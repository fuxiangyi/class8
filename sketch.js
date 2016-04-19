var particleSystem = [];
var attractors = [];
var table1;
var table2;
var aggregated = [];
var cCategory = [];
var investorsAggregated = [];
var connections = [];
var initialarray = [];
var companyToDisplay = [];
var attractorsV = [];
var investorToDisplay = [];
var investorsSystem = [];
var springs = [];
var timeline = [];
var button;




function preload() {
    //load the table in
    table1 = loadTable("data/investments.csv", "csv", "header");
    table2 = loadTable("data/companies_categories.csv", "csv", "header");
}


function setup() {


    //draw a button 
    var canvas = createCanvas(windowWidth, windowHeight);






    //text
    frameRate(30);
    textAlign(CENTER);
    textSize(11);
    textFont("Lucida Grande");
    textStyle(BOLD);

    //color mode
    colorMode(RGB, 255, 255, 255, 255);

    // read and translate the array to object
    for (var r = 0; r < table1.getRowCount(); r++) {
        var comName = table1.getString(r, "company_name");
        var InvName = table1.getString(r, "investor_name");
        var invested = table1.getString(r, "amount_usd");
        var time = table1.getString(r, "funded_at");
        invested = parseInt(invested);
        if (!isNaN(invested)) {
            if (aggregated.hasOwnProperty(comName)) {
                aggregated[comName] = aggregated[comName] + invested;

            } else {
                aggregated[comName] = invested;
            }

        }
        investorsAggregated[InvName] = time;
    }



    //lets put the object into a array
    var aAggregated = [];
    Object.keys(aggregated).forEach(function (name) {
        var company = {};
        company.name = name;
        company.sum = aggregated[name];
        aAggregated.push(company);
    });


    var investors = [];
    Object.keys(investorsAggregated).forEach(function (name) {
        var investor = {};
        investor.name = name;
        investor.time = investorsAggregated[name];
        investors.push(investor);
    });
    //console.log(investors);

    // sort the array 
    aAggregated.sort(function (a, b) {
        return b.sum - a.sum;
    });

    //narrow down the array to number of 100
    aAggregated = aAggregated.slice(0, 100);
    //console.log(aAggregated);   

    for (var r = 0; r < table1.getRowCount(); r++) {
        var comName = table1.getString(r, "company_name");
        var InvName = table1.getString(r, "investor_name");
        var invested = table1.getString(r, "amount_usd");
        var time = table1.getString(r, "funded_at");
        invested = parseInt(invested);

        var foundCompany = aAggregated.find(function (element, index, array) {            
            return element.name == comName;        
        });               

        if (foundCompany) { 
            var foundInvestor = investors.find(function (element, index, array) {            
                return (element.name == InvName);        
            });
            if (foundInvestor) {
                var connection = {};
                connection.company = foundCompany;
                connection.investor = foundInvestor;
                connection.amount = invested;
                connection.time = time;
                connections.push(connection);


            }

        }

    }



    // setup the company particles
    for (var i = 0; i < aAggregated.length; i++) {
        var p = new Particles(aAggregated[i].name, aAggregated[i].sum);
        companyToDisplay.push(p);
        particleSystem.push(p);

    }
    // console.log(companyToDisplay);



    // setup investor particles
    for (var i = 0; i < connections.length; i++) {
        var p = new Investor(connections[i].investor.name, connections[i].amount, connections[i].time);
        connections[i].investor = p;
        investorsSystem.push(p);

    }

    // sort the connection array 
    connections.sort(function (a, b) {
        if (a.time > b.time) return 1;
        else if (a.time == b.time) return 0;
        else if (a.time < b.time) return -1;
    });


    // console.log(connections);


    // setup the attractor to company 
    var at = new Attractor(createVector((width / 3) * 2, height / 3), 5);
    attractors.push(at);

    // setup the oposite attractor to investor 
    var atv = new Attractor(createVector(width / 2, height / 2), 5);
    attractorsV.push(atv);
}



function draw() {

    background(255);

    //creat a collision system for  companies   
    for (var STEP = 0; STEP < 3; STEP++) { //itteration about the collsion. 
        for (var i = 0; i < particleSystem.length - 1; i++) {
            for (var j = i + 1; j < particleSystem.length; j++) {
                var pa = particleSystem[i];
                var pb = particleSystem[j];
                var ab = p5.Vector.sub(pb.position, pa.position);
                var distSq = ab.magSq();
                if (distSq <= sq(pa.radius + pb.radius)) {
                    var dist = sqrt(distSq);
                    var overlap = (pa.radius + pb.radius) - dist;
                    ab.div(dist);
                    ab.mult(overlap * 0.5);
                    pb.position.add(ab);
                    ab.mult(-1);
                    pa.position.add(ab);
                    pa.vel.mult(0.97);
                    pb.vel.mult(0.97);

                }
            }
        }
    }


    if (companyToDisplay.length == 1) {
        var p = companyToDisplay[0];
        p.vel.mult(0.6);
    }

    //draw particles for companiess;
    companyToDisplay.forEach(function (d) {
        d.update();
        d.draw();
    })





    // draw particles for investors
    investorToDisplay.forEach(function (p) {
        p.update();
        p.draw();
    });
    // console.log(investorToDisplay);


    //draw attractors for companies         
    attractors.forEach(function (at) {
        at.draw();
    });

    //draw oposit attractors for investors
    attractorsV.forEach(function (atv) {
        atv.draw();
    });

}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);

}

//creat a mouse click event for companies
function mouseClicked() {
    button = createButton("");
    //give it an id in p5js
    button.id('something');
    button.mousePressed(companyGoBack);
    button.size(20, 20);
    var particleClicked = null;
    companyToDisplay.forEach(function (p) {
        if (p.getMouseOver()) {
            particleClicked = p;
        }
    });

    if (particleClicked != null) {
        companyToDisplay = [];
        investorToDisplay = [];
        companyToDisplay.push(particleClicked);


    } else {
        companyToDisplay = [];
        investorToDisplay = [];
        particleSystem.forEach(function (p) {
            companyToDisplay.push(p);

        });
    }

    //    console.log(companyToDisplay);
    //    console.log(connections);

    investorToDisplay = [];
    connections.forEach(function (d) {
        if (particleClicked != null) {
            if (d.company.name == particleClicked.name) {
                investorToDisplay.push(d.investor);
            }
        }
    });

    var ang = -HALF_PI;

    investorToDisplay.forEach(function (p) {
        p.pos.x = (width / 3) * 2 + cos(ang) * 300;
        p.pos.y = height / 2 + sin(ang) * 300;
        ang += TWO_PI / investorToDisplay.length;
    });


    //console.log(investorToDisplay);

}

//creat a button for companytodisplay arrary to return 
function companyGoBack() {
    button.hide();
    companyToDisplay = [];
    investorToDisplay = [];
    particleSystem.forEach(function (p) {
        companyToDisplay.push(p);
    });
}

//class for drawing companies particles
var Particles = function (name, sum) {
    this.name = name;
    this.sum = sum;
    var R;
    var G;
    var B;

    var rowCat = table2.findRow(this.name, "name");
    if (rowCat != null) {
        this.category = rowCat.get("category_code");
    } else {
        //print(this.name);
        this.category = "other";
    }

    switch (this.category) {
    case "ecommerce":
        R = 211;
        G = 60;
        B = 71;
        break;
    case "cleantech":
        R = 227;
        G = 117;
        B = 37;
        break;
    case "biotech":
        R = 157;
        G = 91;
        B = 162;
        break;
    case "web":
        R = 102;
        G = 175;
        B = 198;
        break;
    case "software":
        R = 94;
        G = 190;
        B = 130;
        break;
    case "mobile":
        R = 48;
        G = 67;
        B = 155;
        break;
    default:
        R = 205;
        G = 193;
        B = 197;
    }

    var isMouseOver = false;


    this.radius = sqrt(sum) / 3200;


    var initialRadius = this.radius;
    var maxR = 70;


    var tempAng = random(TWO_PI);
    this.position = createVector(cos(tempAng), sin(tempAng));
    this.position.div(this.radius);
    this.position.mult(1000);
    this.position.set(this.position.x + (width / 3) * 2, this.position.y + height / 3);
    this.vel = createVector(0, 0);
    var acc = createVector(0, 0);

    this.update = function () {
        checkMouse(this);

        attractors.forEach(function (A) {
            var att = p5.Vector.sub(A.getPos(), this.position);
            var distanceSq = att.magSq();
            if (distanceSq > 10) {
                att.normalize()
                att.div(10);
                acc.add(att);
            }
        }, this);
        this.vel.add(acc);
        this.position.add(this.vel);
        acc.mult(0);

    }



    this.draw = function () {

        noStroke();
        if (isMouseOver) {
            fill(225, 225, 225);
        } else {
            fill(R, G, B);

        }

        ellipse(this.position.x, this.position.y, this.radius * 2, this.radius * 2);

        if (this.radius == maxR) {

            fill(0, 0, 0);
            text(this.name, this.position.x, this.position.y - 5);
            text('$' + nfc(this.sum), this.position.x, this.position.y + 11);
            text(this.category, this.position.x, this.position.y + 27);
        }
    }



    function checkMouse(instance) {
        var mousePos = createVector(mouseX, mouseY);
        if (mousePos.dist(instance.position) <= instance.radius) {
            incRadius(instance);
            isMouseOver = true;
        } else {
            decRadius(instance);
            isMouseOver = false;
        }
    }


    function incRadius(instance) {
        instance.radius += 4;
        if (instance.radius > maxR) {
            instance.radius = maxR;
        }
    }


    function decRadius(instance) {
        instance.radius -= 4;
        if (instance.radius < initialRadius) {
            instance.radius = initialRadius;
        }
    }

    this.getMouseOver = function () {
        return isMouseOver;
    }
}

//class for drawing investor 
var Investor = function (name, amount, time) {

    this.name = name;
    this.amount = amount;
    this.time = time;

    this.radius = sqrt(this.amount) / 500;
    var initialRadius = this.radius;
    var maxR = 120;



    var tempAng = 0;

    this.pos = createVector(cos(tempAng), sin(tempAng));

    var isMouseOver = false;


    this.update = function () {
        checkMouse(this);
    }



    this.draw = function () {

        if (isMouseOver) {

            fill(100, 100, 120, 100)

        } else {
            fill(150, 150, 150, 200);

        }

        ellipse(this.pos.x
            , this.pos.y
            , this.radius
            , this.radius);

        if (this.radius == maxR) {
            noStroke();
            fill(0, 0, 0);
            textSize(9);

            text(this.name, this.pos.x, this.pos.y - 5);
            text('$' + nfc(this.amount), this.pos.x, this.pos.y + 11);
            text(time, this.pos.x, this.pos.y + 27);
        }
    }


    function checkMouse(instance) {
        var mousePos = createVector(mouseX, mouseY);
        if (mousePos.dist(instance.pos) <= instance.radius) {
            incRadius(instance);
            isMouseOver = true;
        } else {
            decRadius(instance);
            isMouseOver = false;
        }
    }


    function incRadius(instance) {
        instance.radius += 10;
        if (instance.radius > maxR) {
            instance.radius = maxR;
        }
    }


    function decRadius(instance) {
        instance.radius -= 10;
        if (instance.radius < initialRadius) {
            instance.radius = initialRadius;
        }
    }

    function getMouseOver() {
        return isMouseOver;
    }


};

var Spring = function (pa, pb, length) {

    this.a = pa;
    this.b = pb;
    this.resLength = length;
    this.strength = 0.1;

    this.draw = function () {
        stroke(0, 100, 255);
        strokeWeight(map(this.resLength, 0, 60, 5, 0.1))
        line(this.a.pos.x, this.a.pos.y, this.b.pos.x, this.b.pos.y);
    }

    this.update = function () {
        var delta = p5.Vector.sub(this.a.pos, this.b.pos);
        var dist = delta.mag();
        var disp = 1 - (this.resLength / dist);
        delta.mult(disp * 0.5 * this.strength);

        this.a.pos.sub(delta);
        this.b.pos.add(delta);
    }

}

//class for drawing attractors
var Attractor = function (position, s) {
    var pos = position.copy();
    var strength = s;

    this.draw = function () {
        noStroke();
        fill(0, 0, 0, 0);
        ellipse(pos.x, pos.y
            , strength, strength);
    }

    this.getStrength = function () {
        return strength;
    }

    this.getPos = function () {
        return pos.copy();
    }
};
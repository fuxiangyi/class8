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
var button;
var attractorsV = [];
var investorToDisplay = [];
var investorsSystem = [];



function preload() {
    //load the table in
    table1 = loadTable("data/investments.csv", "csv", "header");
    table2 = loadTable("data/companies_categories.csv", "csv", "header");
}


function setup() {
    var canvas = createCanvas(windowWidth, windowHeight);

    //draw a button 
    button = createButton('go back to all companies');
    button.position(width / 2 - 60, (height / 5) * 4);
    button.mousePressed(companyGoBack);

    //text
    frameRate(30);
    textAlign(CENTER);
    textSize(11);
    textFont("Futura");
    textStyle(BOLD);

    //color mode
    colorMode(RGB, 255, 255, 255, 1);

    // read and translate the array to object
    for (var r = 0; r < table1.getRowCount(); r++) {
        var comName = table1.getString(r, "company_name"); // get the data from csv file  p5.Table reference
        var InvName = table1.getString(r, "investor_name");
        var invested = table1.getString(r, "amount_usd");
        invested = parseInt(invested); // convert string to int number
        if (!isNaN(invested)) { // if invested is a number(if invested is not a NaN)
            if (aggregated.hasOwnProperty(comName)) {
                aggregated[comName] = aggregated[comName] + invested; //create object of array =obj["company_name"] = string + string 

            } else {
                aggregated[comName] = invested;
            }

        }
        investorsAggregated[InvName] = "";

    }



    //lets put the object into a array
    var aAggregated = [];
    Object.keys(aggregated).forEach(function (name) { //Object.keys(object array) return a array object
        var company = {};
        company.name = name;
        company.sum = aggregated[name];
        aAggregated.push(company);
    });


    var investors = [];
    Object.keys(investorsAggregated).forEach(function (name) { //Object.keys(object array) return a array object
        var investor = {};
        investor.name = name;
        investors.push(investor);
    });

    // sort the array 
    aAggregated.sort(function (a, b) { //array.sort -- comparason function -- number, string, object
        return b.sum - a.sum; //sort desending order here   -- asending order a.sum - b.sum
    });

    //narrow down the array to number of 100
    aAggregated = aAggregated.slice(0, 100);
    print(aAggregated);   
    //creat a new object array for connections between investor and company 
    for (var r = 0; r < table1.getRowCount(); r++) { //second parse data
        var comName = table1.getString(r, "company_name"); // get the data from csv file  p5.Table reference
        var InvName = table1.getString(r, "investor_name");
        var invested = table1.getString(r, "amount_usd");
        invested = parseInt(invested); // convert string to int number

        var foundCompany = aAggregated.find(function (element, index, array) {            
            return element.name == comName;        
        });               

        if (foundCompany) { 
            var foundInvestor = investors.find(function (element, index, array) {            
                return (element.name == InvName);        
            });
            if (foundInvestor) {
                var connection = {};
                connection.company = foundCompany; //object from aAggregated
                connection.investor = foundInvestor; //object from investors
                connection.amount =   invested;
                connections.push(connection);


            }

        }


    }
    console.log(connections)

    // sort the connection array 
    connections.sort(function (a, b) { //array.sort -- comparason function -- number, string, object
        return b.amount - a.amount; //sort desending order here   -- asending order a.sum - b.sum
    });

    // narrow down the connection array to number of 100
    //    connections = connections.slice(0,100);
    //    
    //    print(connections);
    //    


    // setup the company particles
    for (var i = 0; i < aAggregated.length; i++) {
        var p = new Particles(aAggregated[i].name, aAggregated[i].sum);
        companyToDisplay.push(p);
        particleSystem.push(p);

    }
    print(companyToDisplay);



    // setup investor particles
    for (var i = 0; i < connections.length; i++) {
        var p = new Investor(connections[i].investor.name, 2);
        investorsSystem.push(p);
        investorToDisplay.push(p);
    }
    //console.log(investorsSystem);

    // setup the attractor to company 
    var at = new Attractor(createVector(width / 2, height / 2), 5);
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
                    pb.vel.mult(0.97); // this line decrease the particle's velocity everytime the particle collision

                }
            }
        }
    }

    //creat a collision system for investors.
    //    for (var STEPS = 0; STEPS<3; STEPS++) {
    //            for (var i=0; i<investorsSystem.length-1; i++){
    //                for (var j=i+1; j<investorsSystem.length; j++){
    //                    var pa = investorsSystem[i];
    //                    var pb = investorsSystem[j];
    //                    var ab = p5.Vector.sub(pb.pos, pa.pos);
    //                    var distSq = ab.magSq();
    //                    if(distSq <= sq(pa.radius + pb.radius)){
    //                        var dist = sqrt(distSq);
    //                        var overlap = (pa.radius + pb.radius) - dist;
    //                        ab.div(dist);
    //                        ab.mult(overlap*0.5);
    //                        pb.pos.add(ab);
    //                        ab.mult(-1);
    //                        pa.pos.add(ab);
    //                        //friction
    //                        pa.vel.mult(0.98);
    //                        pb.vel.mult(0.98);
    //                        
    //                    }
    //                }
    //            }
    //        }
    //    
    //draw particles for companies;
    for (var i = companyToDisplay.length - 1; i >= 0; i--) {
        var p = companyToDisplay[i];
        p.update();
        p.draw();

    }


    // draw particles for investors
    for (var i = investorToDisplay.length - 1; i >= 0; i--) {
        var p = investorToDisplay[i];
        p.update();
        p.draw();

    }


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
    var particleClicked = null;
    companyToDisplay.forEach(function (p) {
        if (p.getMouseOver()) {
            particleClicked = p;
        }
    });

    if (particleClicked != null) {
        //we can click on the company
        //empty the companyToDisplayArray
        companyToDisplay = [];
        companyToDisplay.push(particleClicked);
    }

    //     console.log(companyToDisplay);
    //    print(connections);

    investorToDisplay = [];
    connections.forEach(function (d) {
        if (particleClicked != null) {
            if (d.company.name == particleClicked.name) {
                investorToDisplay.push(d.investor)
            }
        }
    });

    console.log(investorToDisplay);

}

//creat a button for companytodisplay arrary to return 
function companyGoBack() {
    //    companyToDisplay=[];
    //    investorToDisplay=[];
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
        print(this.name);
        this.category = "other";
    }

    switch (this.category) {
    case "ecommerce":
        R = 30;
        G = 100;
        B = 255;
        break;
    case "cleantech":
        R = 46;
        G = 139;
        B = 87;
        break;
    case "biotech":
        R = 72;
        G = 61;
        B = 139;
        break;
    case "social":
        R = 205;
        G = 92;
        B = 92;
        break;
    case "software":
        R = 200;
        G = 0;
        B = 58
        break;
    case "mobile":
        R = 0;
        G = 10;
        B = 100;
        break;
    default:
        R = 205;
        G = 193;
        B = 197;
    }

    var isMouseOver = false;


    this.radius = sqrt(sum) / 4000;


    var initialRadius = this.radius;
    var maxR = 70;


    var tempAng = random(TWO_PI);
    this.position = createVector(cos(tempAng), sin(tempAng));
    this.position.div(this.radius); //try to put bigger one near to the center --> if the radius is high the posistion is lower
    this.position.mult(1000);
    this.position.set(this.position.x + width / 2, this.position.y + height / 2); //create initial position and make it center. 
    this.vel = createVector(0, 0);
    var acc = createVector(0, 0);

    this.update = function () {
        checkMouse(this);

        attractors.forEach(function (A) {
            var att = p5.Vector.sub(A.getPos(), this.position); //if did not put this after the function(A), this here means A// 
            var distanceSq = att.magSq();
            if (distanceSq > 10) {
                att.normalize()
                att.div(10);
                acc.add(att);
            }
        }, this);
        this.vel.add(acc); //should add this.acceleration here! if use this.velocity here, the same with velocity
        this.position.add(this.vel);
        acc.mult(0); //reset the acceraltion      

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
            text(this.name, this.position.x, this.position.y);
            text(this.sum, this.position.x, this.position.y + 16);
            text(this.category, this.position.x, this.position.y + 32);
        }
    }



    function checkMouse(instance) { // this is a pravite function inside of particles function, 'this' is nor work here
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
var Investor = function (iname, r) {

    this.iname = iname
    var investorRadius = r;


    var tempAng = random(TWO_PI);

    this.pos = createVector(sin(tempAng), cos(tempAng));
    this.pos.mult(300);
    this.pos.add(width / 2, height / 2);
    this.vel = createVector(0, 0);
    var acc = createVector(0, 0);

    this.update = function () {

        attractors.forEach(function (A) {
            var att = p5.Vector.sub(A.getPos(), this.pos);
            var distanceSq = att.magSq();
            if (distanceSq > 1) {
                att.normalize();
                att.div(1);
                acc.add(att);
            }

        }, this);

        //REPULSOR
        attractorsV.forEach(function (R) {
            var attv = p5.Vector.sub(R.getPos(), this.pos);
            var distanceSq = attv.magSq();
            if (distanceSq > 1) {
                attv.normalize();
                attv.div(-1);

                acc.add(attv);
            }

        }, this);

        this.pos.add(this.vel);
        this.vel.add(acc);
        acc.mult(0);

    }



    this.draw = function () {
        noStroke();
        ellipse(this.pos.x
            , this.pos.y
            , investorRadius
            , investorRadius);
    }


    this.getRadius = function () {
        return investorRadius; //strength here is a variable.
    }


};

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
        return strength; //strength here is a variable.
    }

    this.getPos = function () {
        return pos.copy();
    }
};
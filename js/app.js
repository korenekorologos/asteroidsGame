const FPS = 30; //the frames per second 
const FRICTION = 0.7; //friction coefficient of space (0 = no friction, 1 = lots of friction)
const ROID_JAG = 0.4; //jaggedness of the asteroids. 0 = none. 1 = lots 
const ROID_NUM = 7; //starting number of astroids 
const ROID_SIZE = 100; //starting size of the astroids in pixels 
const ROID_SPD = 50; //max starting speed of astroids in pizels per second
const ROID_VERT = 10; //average number of vertices on each asteroid
const SHIP_BLINK_DUR = 0.1; //duration of the ships blink during invisibility in seconds 
const SHIP_EXPLODE_DUR = 0.3; //duration of the ships explosion 
const SHIP_INV_DUR = 3; //duration of the ships invisibility in seconds  
const SHIP_SIZE = 30;  //ship height in pixels 
const SHIP_PUSH = 5; //acceleration of the ship in pixels per second. each second increases by 5  
const TURN_SPD = 360; //turn speed in the degrees per second 
const SHOW_BOUNDING = false;  //show or hide collision bounding 
const SHOW_CENTRE_DOT = false; //show or hide ships center dot 


/**@type {HTML CanvasElement} */
//canvas info 
var canv = document.getElementById("gameCanvas");
//context from canvas 
var ctx = canv.getContext("2d");
//spaceshit object 
var ship = newShip();


// var ship = {
//     x: canv.width / 2,
//     y: canv.height / 2,
//     r: SHIP_SIZE / 2,   //radius 
//     a: 90 / 180 * Math.PI,  //a = angle. convert 90 into radians 
//     explodeTime: 0, //zero frames left of exploding 
//     rot: 0, //rotation 
//     pushing: false,  //not stoping 
//     push: { //sets the magnitude for the push 
//         x: 0,
//         y: 0
//     }
// }

//astroids 
var roids = [];
createAsteroidBelt();


//event handlers 
//type = "keydown". alerted when one of the keys are pressed 
//function called = keyDown 
document.addEventListener("keydown", keyDown);
document.addEventListener("keyup", keyUp); //when the key is released 


//game loop, for animation 
setInterval(update, 1000 / FPS);


function createAsteroidBelt() {
    roids = [];
    var x, y;
    //loop
    for (var i = 0; i < ROID_NUM; i++) {
        //makes it so that asteriod is not positioned on the rocket when starting the game
        do {
            x = Math.floor(Math.random() * canv.width);
            y = Math.floor(Math.random() * canv.height);
        } while (distBetweenPoints(ship.x, ship.y, x, y) < ROID_SIZE * 2 + ship.r);
        roids.push(newAsteroid(x, y));
    }
}

function distBetweenPoints(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}


function explodeShip() {
    ship.explodeTime = Math.ceil(SHIP_EXPLODE_DUR * FPS);
}


function keyDown(/** @type {KeyboardEvent} */ ev) {
    switch (ev.keyCode) {  //to make it so that arrow keys can be the only ones pressed 

        case 37:  //left arrow (rotate ship left)
            ship.rot = TURN_SPEED / 180 * Math.PI / FPS;
            break;
        case 38: //up arrow (moves the ship forward)
            ship.pushing = true;
            break;
        case 39: //right arrow (rotates the ship right)
            ship.rot = -TURN_SPEED / 180 * Math.PI / FPS;
            break;
    }
}


function keyUp(/** @type {KeyboardEvent} */ ev) {
    switch (ev.keyCode) {  //to make it so that arrow keys can be the only ones pressed 

        case 37:  //left arrow (shop rotatating ship left)
            ship.rot = 0;
            break;
        case 38: //up arrow (stop moving the ship forward)
            ship.pushing = false;
            break;
        case 39: //right arrow (stop rotating the ship right)
            ship.rot = 0;
            break;
    }
}


function newAsteroid(x, y) {
    var roid = {
        x: x,
        y: y,
        //positive and negative direction they're going 
        xv: Math.random() * ROID_SPD / FPS * (Math.random() < 0.5 ? 1 : -1),
        yv: Math.random() * ROID_SPD / FPS * (Math.random() < 0.5 ? 1 : -1),
        r: ROID_SIZE / 2,
        a: Math.random() * Math.PI * 2, //in radians 
        vert: Math.floor(Math.random() * (ROID_VERT + 1) + ROID_VERT / 2),
        offs: []
    };

    //create the vertex which offsets array 
    for (var i = 0; i < roid.vert; i++) {
        roid.offs.push(Math.random() * ROID_JAG * 2 + 1 - ROID_JAG);
    }

    return roid;
}


function newShip() {
    return {
        x: canv.width / 2,
        y: canv.height / 2,
        r: SHIP_SIZE / 2,   //radius 
        a: 90 / 180 * Math.PI,  //a = angle. convert 90 into radians 
        blinkNum: Math.ceil(SHIP_INV_DUR / SHIP_BLINK_DUR),  //15 blinks off, 15 blinks on 
        blinkTime: Math.ceil(SHIP_BLINK_DUR * FPS),
        explodeTime: 0, //zero frames left of exploding 
        rot: 0, //rotation 
        pushing: false,  //not stoping 
        push: { //sets the magnitude for the push 
            x: 0,
            y: 0
        }
    }
}



function update() {
    var blinkOn = ship.blinkNum % 2 == 0;
    var exploding = ship.explodeTime > 0;


    //draw space 
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canv.width, canv.height);


 // draw the asteroids
 var a, r, x, y, offs, vert;
 for (var i = 0; i < roids.length; i++) {
     ctx.strokeStyle = "slategrey";
     ctx.lineWidth = SHIP_SIZE / 20;

     // get the asteroid properties
     a = roids[i].a;
     r = roids[i].r;
     x = roids[i].x;
     y = roids[i].y;
     offs = roids[i].offs;
     vert = roids[i].vert;
     
     // draw the path
     ctx.beginPath();
     ctx.moveTo(
         x + r * offs[0] * Math.cos(a),
         y + r * offs[0] * Math.sin(a)
     );

     // draw the polygon
     for (var j = 1; j < vert; j++) {
         ctx.lineTo(
             x + r * offs[j] * Math.cos(a + j * Math.PI * 2 / vert),
             y + r * offs[j] * Math.sin(a + j * Math.PI * 2 / vert)
         );
     }
     ctx.closePath();
     ctx.stroke();

     // show asteroid's collision circle
     if (SHOW_BOUNDING) {
         ctx.strokeStyle = "lime";
         ctx.beginPath();
         ctx.arc(x, y, r, 0, Math.PI * 2, false);
         ctx.stroke();
     }
 }



    //push the ship
    //FPS = frames per second 
    if (ship.pushing) {
        ship.push.x += SHIP_PUSH * Math.cos(ship.a) / FPS;
        ship.push.y -= SHIP_PUSH * Math.sin(ship.a) / FPS;


        //flame from the rocket 
        if (!exploding && blinkOn) {
            ctx.fillStyle = "red";
            ctx.strokeStyle = "yellow";
            ctx.lineWidth = SHIP_SIZE / 10; //makes for a thicker line
            ctx.beginPath();

            ctx.moveTo( //rear left 
                ship.x - ship.r * (2 / 3 * Math.cos(ship.a) + 0.5 * Math.sin(ship.a)),
                ship.y + ship.r * (2 / 3 * Math.sin(ship.a) - 0.5 * Math.cos(ship.a))
            );

            ctx.lineTo(  //rear center, behind the ship 
                ship.x - ship.r * 6 / 3 * Math.cos(ship.a),
                ship.y + ship.r * 6 / 3 * Math.sin(ship.a)
            );

            ctx.lineTo(  //rear right of the ship 
                ship.x - ship.r * (2 / 3 * Math.cos(ship.a) - 0.5 * Math.sin(ship.a)),
                ship.y + ship.r * (2 / 3 * Math.sin(ship.a) + 0.5 * Math.cos(ship.a))
            );
        
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
        }

        // //lime circle around ship 
        // if (SHOW_BOUNDING) {
        //     ctx.strokeStyle = "lime";
        //     ctx.beginPath();
        //     ctx.arc(ship.x, ship.y, ship.r, 0, Math.PI * 2, false);
        //     ctx.stroke();
        // }


    } else {
        ship.push.x -= FRICTION * ship.push.x / FPS;
        ship.push.y -= FRICTION * ship.push.y / FPS;
    }


    //draw triangular ship 
    if (!exploding) {
        if (blinkOn) {  //if blink is on, then we'll draw the ship 

            ctx.strokeStyle = "white";
            ctx.lineWidth = SHIP_SIZE / 20;
            ctx.beginPath();

            ctx.moveTo( //nose of the ship 
                ship.x + 4 / 3 * ship.r * Math.cos(ship.a),
                ship.y - 4 / 3 * ship.r * Math.sin(ship.a) //negative represents upwards on the screen 
            );

            ctx.lineTo(  //rear left of the ship 
                ship.x - ship.r * (2 / 3 * Math.cos(ship.a) + Math.sin(ship.a)),  //got these equations by using trigonometry 
                ship.y + ship.r * (2 / 3 * Math.sin(ship.a) - Math.cos(ship.a))
            );

            ctx.lineTo(  //rear right of the ship 
                ship.x - ship.r * (2 / 3 * Math.cos(ship.a) - Math.sin(ship.a)),  //got these equations by using trigonometry 
                ship.y + ship.r * (2 / 3 * Math.sin(ship.a) + Math.cos(ship.a))
            );

            ctx.closePath();  //closes the lines from the right & left rears 
            ctx.stroke();
        }

        //handle blinking 
        if (ship.blinkNum > 0) {
            //reduce the blink time 
            ship.blinkTime--;

            //reduce the blink num 
            if (ship.blinkTime == 0) {
                ship.blinkTime = Math.ceil(SHIP_BLINK_DUR * FPS);
                ship.blinkNum--;
            }
        }

    } else {
        //draw the explosion 
        ctx.fillStyle = "darkred";
        ctx.beginPath();
        ctx.arc(ship.x, ship.y, ship.r * 1.7, 0, Math.PI * 2, false);
        ctx.fill();

        ctx.fillStyle = "red";
        ctx.beginPath();
        ctx.arc(ship.x, ship.y, ship.r * 1.4, 0, Math.PI * 2, false);
        ctx.fill();

        ctx.fillStyle = "orange";
        ctx.beginPath();
        ctx.arc(ship.x, ship.y, ship.r * 1.1, 0, Math.PI * 2, false);
        ctx.fill();

        ctx.fillStyle = "yellow";
        ctx.beginPath();
        ctx.arc(ship.x, ship.y, ship.r * 0.8, 0, Math.PI * 2, false);
        ctx.fill();

        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.arc(ship.x, ship.y, ship.r * 0.5, 0, Math.PI * 2, false);
        ctx.fill();
    }

    if (SHOW_BOUNDING) {
        ctx.strokeStyle = "lime";
        ctx.beginPath();
        ctx.arc(ship.x, ship.y, ship.r, 0, Math.PI * 2, false);
        ctx.stroke();
    }



    //draw the astriods, loop through each 
    var x, y, r, a, vert, offs;


    for (var i = 0; i < roids.length; i++) {
        ctx.strokeStyle = "slategrey";
        ctx.lineWidth = SHIP_SIZE / 20;

        //get the asteroid properties 
        x = roids[i].x;
        y = roids[i].y;
        r = roids[i].r;
        a = roids[i].a;
        vert = roids[i].vert;
        offs = roids[i].offs;

        //draw a path 
        ctx.beginPath();
        ctx.moveTo(
            x + r * offs[0] * Math.cos(a),
            y + r * offs[0] * Math.sin(a)
        );

        //draw the polygon 
        //the polygon sizes and sides are random. they vary from 5-15 sided
        for (var j = 1; j < vert; j++) {
            ctx.lineTo(
                x + r * offs[j] * Math.cos(a + j * Math.PI * 2 / vert),
                y + r * offs[j] * Math.sin(a + j * Math.PI * 2 / vert)
            );
        }
        ctx.closePath();
        ctx.stroke(); //draws it 


        if (SHOW_BOUNDING) {
            ctx.strokeStyle = "lime";
            ctx.beginPath();
            ctx.arc(x, y, r, 0, Math.PI * 2, false);
            ctx.stroke();
        }
    }


    //centre dot 
    if (SHOW_CENTRE_DOT) {
        ctx.fillStyle = "red";
        ctx.fillRect(ship.x - 1, ship.y - 1, 2, 2);
    }


    //create asteroid collisions 
    if (!exploding) {
        //notcheck if not blinking 
        if (ship.blinkNum == 0) {
            for (var i = 0; i < roids.length; i++) {
                if (distBetweenPoints(ship.x, ship.y, roids[i].x, roids[i].y) < ship.r + roids[i].r) {
                    explodeShip();
                }
            }
        }

        //rotate ship 
        ship.a += ship.rot;

        //move the ship
        ship.x += ship.push.x;
        ship.y += ship.push.y;
    } else {
        ship.explodeTime--; //reduces the time left on the explosion 

        if (ship.explodeTime == 0) {
            ship = newShip();
        }
    }

    //so that the rocket doesn't get lost off of the screen. this will make it so
    //that it comes back to the screen 
    if (ship.x < 0 - ship.r) {
        ship.x = canv.width + ship.r;
    } else if (ship.x > canv.width + ship.r) {
        ship.x = 0 - ship.r;
    }
    if (ship.y < 0 - ship.r) {
        ship.y = canv.height + ship.r;
    } else if (ship.y > canv.height + ship.r) {
        ship.y = 0 - ship.r;
    }

    //moves the asteroids, in different speeds & directions
    for (var i = 0; i < roids.length; i++) {
        roids[i].x += roids[i].xv;
        roids[i].y += roids[i].yv;

        //makes it so that astroids don't disapear off the screen 
        //for the x direction 
        if (roids[i].x < 0 - roids[i].r) {
            roids[i].x = canv.width + roids[i].r;
        } else if (roids[i].x > canv.width + roids[i].r) {
            roids[i].x = 0 - roids[i].r
        }

        //for the y direction 
        if (roids[i].y < 0 - roids[i].r) {
            roids[i].y = canv.height + roids[i].r;
        } else if (roids[i].y > canv.height + roids[i].r) {
            roids[i].y = 0 - roids[i].r
        }

    }

    //ctx.fillStyle = "red";
    //ctx.fillRect(ship.x - 1, ship.y - 1, 2, 2);

}

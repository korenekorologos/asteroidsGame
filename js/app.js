const FPS = 30; //the frames per second 
const FRICTION = 0.7; //friction coefficient of space (0 = no friction, 1 = lots of friction)
const SHIP_SIZE = 30;  //ship height in pixels 
const SHIP_PUSH = 5; //acceleration of the ship in pixels per second. each second increases by 5  
const TURN_SPEED = 360; //turn speed in the degrees per second 


/**@type {HTML CanvasElement} */
//canvas info 
var canv = document.getElementById("gameCanvas");

//context from canvas 
var ctx = canv.getContext("2d");

var ship = {
    x: canv.width / 2,
    y: canv.height / 2,
    r: SHIP_SIZE / 2,   //radius 
    a: 90 / 180 * Math.PI,  //a = angle. convert 90 into radians 
    rot: 0, //rotation 
    pushing: false,  //not stoping 
    push: { //sets the magnitude for the push 
        x: 0,
        y: 0
    }
}

//astroids 



//event handlers 
//type = "keydown". alerted when one of the keys are pressed 
//function called = keyDown 
document.addEventListener("keydown", keyDown);
document.addEventListener("keyup", keyUp); //when the key is released 


//game loop, for animation 
setInterval(update, 1000 / FPS);


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

function update() {
    //draw space 
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canv.width, canv.height);

    //push the ship
    //FPS = frames per second 
    if (ship.pushing) {
        ship.push.x += SHIP_PUSH * Math.cos(ship.a) / FPS;
        ship.push.y -= SHIP_PUSH * Math.sin(ship.a) / FPS;


        //flame from the rocket 
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


    } else {
        ship.push.x -= FRICTION * ship.push.x / FPS;
        ship.push.y -= FRICTION * ship.push.y / FPS;
    }


    //draw triangular ship 
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

    //rotate ship 
    ship.a += ship.rot;

    //move the ship
    ship.x += ship.push.x;
    ship.y += ship.push.y;

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

    //centre dot 



    ctx.fillStyle = "red";
    //ctx.fillRect(ship.x - 1, ship.y - 1, 2, 2);

}

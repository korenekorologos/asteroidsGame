const FPS = 30; //the frames per second 
        const SHIP_SIZE = 30;  //ship height in pixels 

        /**@type {HTML CanvasElement} */
        //canvas info 
        var canv = document.getElementById("gameCanvas"); 
        
        //context from canvas 
        var ctx = canv.getContext("2d"); 
        
        var ship = {
            x: canv.width / 2,
            y: canv.height / 2,
            r: SHIP_SIZE / 2,   //radius 
            a: 90 /180  * Math.PI  //a = angle. convert 90 into radians 
        }


        //game loop, for animation 
        //FPS = frames per second 
        setInterval(update, 1000 / FPS); 

        function update() {
            //draw space 
            ctx.fillStyle = "black"; 
            ctx.fillRect(0, 0, canv.width, canv.height); 

            //draw triangular ship 
            ctx.strokeStyle = "white",
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

            //move the ship

            //centre dot 
          
                ctx.fillStyle = "red"; 
                ctx.fillRect(ship.x - 1, ship.y - 1, 2, 2); 
            
        }

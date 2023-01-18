"use strict";

let lander = 0;
let healthDisplay = document.getElementById('health-display-id');

class Lander{
    constructor(coordX){
        this.element = document.getElementById('lander');
        this.health = LANDER_MAX_HEALTH;
        this.coordY = LANDER_STARTING_HEIGHT;
        this.coordX = coordX;
        this.landed = false;
        this.hasFlame = false;
        this.turning = '';
        this.rotation = 0;
        this.thrusting = false;
        this.fuel = LANDER_MAX_FUEL;
        this.speed_vertical = 0;
        this.speed_horizontal = 0;
        this.updateSpeedTimer = 0;
        this.rocketTimeout = 0;
        healthDisplay.textContent = `HULL ${this.health}`;
    }
    static spawn = () => {       
        let newDiv = document.createElement("div");
        let newImg = document.createElement("img");

        const coordX = getRandomCoordX();

        newDiv.className = 'lander';
        newDiv.id = 'lander';
        newDiv.style.width = `${LANDER_WIDTH}px`;
        newDiv.style.height = `${LANDER_HEIGHT}px`;
        newDiv.style.position = 'absolute';
        newDiv.style.left = `${coordX}px`;
        newDiv.style.bottom = `${LANDER_STARTING_HEIGHT}px`;   
        newImg.style.width = '100%';
        newImg.src = "sprites/lander.png";
      
        newDiv.appendChild(newImg);       
        PROJECTILE_CONTAINER.appendChild(newDiv);

        lander = new Lander(coordX);
    }
    addFlame = (add) => {
        if (add && !this.hasFlame){
            let newImg = document.createElement("img");   
            newImg.style.width = '20px';
            newImg.style.marginLeft = '16px';
            newImg.style.marginTop = '-10px';
            newImg.src = "sprites/flame.png";
            this.element.appendChild(newImg);
            this.hasFlame = true;
            sound_thruster.play();
        }
        else {
            if (this.hasFlame) {
                const image = this.element.getElementsByTagName('img');
                this.element.removeChild(image[1]);
                this.hasFlame = false;
                sound_thruster.pause();
            }
        }
    }
    loseHealth = (amount) => {
        console.log('losing hp', amount)
        this.health -= amount;
        healthDisplay.textContent = ` HULL ${this.health}`;
        if (this.health <= 0) {
            this.explode();
            sound_alert.pause();
        }
        else if (this.health < (LANDER_MAX_HEALTH * 0.25))
            sound_alert.play();
    }
    explode = () => {
        sound_lander_explosion.play();
        this.addFlame(false);
        const image = this.element.getElementsByTagName('img');
        this.element.removeChild(image[0]);
        let newImg = document.createElement("img");     
        newImg.src = `sprites/explosion_${Math.floor(Math.random() * 3)}.png`;
        newImg.style.width = '100%';
        this.element.appendChild(newImg);
        gameStage = 'reset';
    }
    despawn = () => {
        this.element.remove();
        lander = 0;
    }
    handle = () =>
    {
        ++this.updateSpeedTimer;            // ONLY UPDATE SPEED EVERY '4 TIMES TICK RATE' (200ms).
        if (4 < this.updateSpeedTimer) {
            this.updateSpeedTimer = 0;

            Object.values(obj_enemies).forEach(e => {
                if (getDistance(this.getCoords(), e.getCoords()) < 1000)
                    this.loseHealth(1);
            });

            if (this.landed){
                if (this.thrusting)               // IF LANDED: RESET ROTATION + PREVENT ROTATING BY CONTROLS.
                    this.landed = false;          // CHECK IF TAKING OFF.
                if (GROUND_HEIGHT < this.coordY)
                    this.landed = false;
                if (this.rotation != 0)
                    this.turning = 'reset_pos';
                else this.turning = '';
            }
            else 
            {
                if (this.hasFlame !== this.thrusting)
                this.addFlame(this.thrusting);

                if (this.thrusting)
                {
                    --this.fuel;
                    FUEL_METER.style.marginTop = `${LANDER_MAX_FUEL - this.fuel}px`;

                    if (this.speed_vertical < LANDER_MAX_VERTICAL_SPEED && -70 < this.rotation && this.rotation < 70)
                        ++this.speed_vertical;

                    if (30 < this.rotation)
                        this.speed_horizontal += 2;        // IF THRUSTING: CALCULATE CHANGE IN VERTICAL AND HORIZONTAL VELOCITY
                    else if (10 < this.rotation)           // DEPENDING ON THE CURRENT ROTATION.
                        this.speed_horizontal += 1;
                    else if (this.rotation < -10)
                        this.speed_horizontal -= 1;
                    else if (this.rotation < -30)
                        this.speed_horizontal -= 2;

                    if (this.speed_horizontal < -LANDER_MAX_VERTICAL_SPEED)
                        this.speed_horizontal = -LANDER_MAX_VERTICAL_SPEED;
                    else if (LANDER_MAX_VERTICAL_SPEED < this.speed_horizontal)
                        this.speed_horizontal = LANDER_MAX_VERTICAL_SPEED;
                }
                else if (GROUND_HEIGHT < this.coordY){
                    if (-5 < this.speed_vertical)         // IF NOT THRUSTING: DECREASE VERTICAL SPEED
                        this.speed_vertical -= 1;         // TO MAKE THE LANDER FALL DOWN.
                    else this.speed_vertical -= 2;
                    if (this.speed_vertical < -LANDER_MAX_VERTICAL_SPEED)
                        this.speed_vertical = -LANDER_MAX_VERTICAL_SPEED;
                }
                else {  // Landed
                    this.turning = 'reset_pos';       // IF coordY <= GROUND HEIGHT -> LANDED.
                    this.speed_horizontal = 0;
                    this.speed_vertical = 0;
                    this.landed = true;
                }

                if ((this.coordX <= gameArea.despawnArea.left && this.speed_horizontal < 0)
                || (gameArea.despawnArea.right < this.coordX && 0 < this.speed_horizontal))
                    this.speed_horizontal = 0;
            }
        }

        if (this.speed_vertical != 0) {
            if (this.coordY < GROUND_HEIGHT && this.speed_vertical < 0) {
                switch(this.speed_vertical){
                    case -LANDER_MAX_VERTICAL_SPEED:
                        this.loseHealth(50);
                        break;
                    case -LANDER_MAX_VERTICAL_SPEED + 1:
                        this.loseHealth(20);
                        break;
                    case -LANDER_MAX_VERTICAL_SPEED + 2:
                        this.loseHealth(8);
                        break;
                }
                this.speed_vertical = 0;
            }
            else {
                this.coordY += this.speed_vertical;               
                this.element.style.bottom = this.coordY + 'px';        
            }                                                   // CALCULATE NEW X AND Y POSITIONS
        }                                                       // BASED ON THE CURRENT VELOCITY.
        if (this.speed_horizontal != 0){
            this.coordX += this.speed_horizontal;
            this.element.style.left = `${this.coordX}px`;     
        }

        switch(this.turning){                           // CHANGE CURRENT ROTATION IF CONTROLS ARE PRESSED
            case 'left':                                    // OR RESET ROTATION IF LANDED.
                this.rotation -= LANDER_TURN_RATE;
                break;
            case 'right':
                this.rotation += LANDER_TURN_RATE;
                break;
            case 'reset_pos':   // Reset rotation when landed
                if (5 < Math.abs(this.rotation))
                    this.rotation -= (1 + (this.rotation / 5));
                else if (this.rotation < 0)
                    this.rotation += (1 + (-this.rotation / 5));
                else this.turning = '';
                break;
            default: return;
            }
        this.element.style.transform = `rotate(${this.rotation}deg)`;
    }
    getCoords = () => {                                                                                 // RETURNS CURRENT LANDER COORDS
        return { 'x': this.coordX + (LANDER_WIDTH * 0.5), 'y': this.coordY + (LANDER_HEIGHT * 0.5) };       // INSIDE THE GAME AREA.
    }
    fireProjectile = (targetCoordX, targetCoordY) => {
        if (gameTimer < this.rocketTimeout)
            return;
        Projectile.spawn(this.coordX + (LANDER_WIDTH * 0.5), this.coordY + (LANDER_HEIGHT * 0.5), targetCoordX, targetCoordY);
        sound_rocket.play();
        this.rocketTimeout = gameTimer + 55;
    }
};
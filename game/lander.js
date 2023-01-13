class Lander{
    constructor(){
        this.id = document.getElementById('lander-hull');
        this.posY = LANDER_STARTING_HEIGHT;
        this.posX = 400;
        this.landed = false;
        this.turning = '';
        this.rotation = 0;
        this.thrusting = false;
        this.id.style.bottom = this.posY + 'px';
        this.id.style.left = this.posX + 'px';
        this.speed_vertical = 0;
        this.speed_horizontal = 0;
        this.updateSpeedTimer = 0;
        this.id.style.width = LANDER_WIDTH;
        this.id.style.height = LANDER_HEIGHT;
    }
    setPosition()
    {
        ++this.updateSpeedTimer;            // ONLY UPDATE SPEED EVERY 4 TIMES TICK RATE (every 4 * 50ms)
        if (4 < this.updateSpeedTimer) {
            this.updateSpeedTimer = 0;

            if (lander.landed){
                if (lander.thrusting)
                    lander.landed = false;
                if (GROUND_HEIGHT < lander.posY)
                    lander.landed = false;
                if (lander.rotation != 0)
                    lander.turning = 'reset_pos';
                else lander.turning = '';
            }
            else 
            {
                if (lander.thrusting)
                {
                    if (lander.speed_vertical < LANDER_MAX_VERTICAL_SPEED && -80 < lander.rotation && lander.rotation < 80)
                        ++lander.speed_vertical;

                    if (30 < lander.rotation)
                        lander.speed_horizontal += 2;
                    else if (10 < lander.rotation)
                        lander.speed_horizontal += 1;
                    else if (lander.rotation < -10)
                        lander.speed_horizontal -= 1;
                    else if (lander.rotation < -30)
                        lander.speed_horizontal -= 2;

                    if (lander.speed_horizontal < -LANDER_MAX_VERTICAL_SPEED)
                        lander.speed_horizontal = -LANDER_MAX_VERTICAL_SPEED;
                    else if (LANDER_MAX_VERTICAL_SPEED < lander.speed_horizontal)
                        lander.speed_horizontal = LANDER_MAX_VERTICAL_SPEED;

                    if (lander.landed)
                    lander.landed = false;
                }
                else if (10 < lander.posY){
                    if (-5 < lander.speed_vertical)
                        lander.speed_vertical -= 1;
                    else lander.speed_vertical -= 2;
                    if (lander.speed_vertical < -LANDER_MAX_VERTICAL_SPEED)
                        lander.speed_vertical = -LANDER_MAX_VERTICAL_SPEED;
                }
                else {  // Landed
                    lander.turning = 'reset_pos'; 
                    lander.speed_horizontal = 0;
                    lander.landed = true;
                }
            }
        }
        if (this.speed_vertical != 0) {
            if (this.posY < GROUND_HEIGHT && this.speed_vertical < 0)
                this.speed_vertical = 0;
            else {
                this.posY += this.speed_vertical;
                this.id.style.bottom = this.posY + 'px';
            }
        }
        if (this.speed_horizontal != 0){
            this.posX += this.speed_horizontal;
            this.id.style.left = `${this.posX}px`;     
        }
    }
    rotate(){
        switch(this.turning){
        case 'left':
            this.rotation -= LANDER_TURN_RATE;
            break;
        case 'right':
            this.rotation += LANDER_TURN_RATE;
            break;
        case 'reset_pos':   // Reset rotation when landed
            if (0 < this.rotation)
            this.rotation -= (1 + (this.rotation / 5));
            else if (this.rotation < 0)
            this.rotation += (1 + (-this.rotation / 5));
            else this.turning = '';
            break;
        }
        this.id.style.transform = `rotate(${this.rotation}deg)`;
    }
    getCoords(){
        return { 'x': this.posX + (LANDER_WIDTH * 0.5), 'y': this.posY + (LANDER_HEIGHT * 0.5) };
    }
    fireProjectile(targetCoordX, ragetCoordY){
        const vector = getVector(this.getCoords(), {'x': targetCoordX, 'y': ragetCoordY});
        projectile.style.transform = `rotate(${vector}deg)`;
        console.log(vector);
        console.log(projectile.style.rotation);
    }
};
let lander = new Lander();
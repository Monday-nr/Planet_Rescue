"use strict";

const SOLDIER_CONTAINER = document.getElementById('soldier_container');
let soldierIDs = 0;
let obj_soldiers = {};

class Soldier {
    constructor(id, coordX){
        this.id = id;
        this.element = document.getElementById(id);
        this.dead = false;
        this.exploded = 0;
        this.coordX = coordX;
        this.coordY = GROUND_HEIGHT;
        this.bearing = 0;
    }
    getCoords = () => {
        return {'x': this.coordX + (SOLDIER_SIZE * 0.5), 'y': this.coordY  + (SOLDIER_SIZE * 0.5) };
    }
    flip = () => {
        const image = this.element.getElementsByTagName('img');
        this.element.removeChild(image[0]);
        let newImg = document.createElement("img");   
        newImg.src = this.bearing === -1 ? `sprites/soldier_left.png` : `sprites/soldier_right.png`;       
        newImg.style.width = '100%';
        this.element.appendChild(newImg);
    }
    kill = (explode) => {
        const image = this.element.getElementsByTagName('img');
        this.element.removeChild(image[0]);
        let newImg = document.createElement("img");   
        if (explode)
            newImg.src = `sprites/explosion_${Math.floor(Math.random() * 4)}.png`;
        else {
            newImg.src = `sprites/blood_${Math.floor(Math.random() * 3)}.png`;
        }
        newImg.style.width = '100%';
        this.element.appendChild(newImg);
        this.dead = !explode;
        this.exploded = explode;
    }
    despawn = () => {
        //if (!this.dead)
            this.element.remove();
        //delete obj_soldiers[this.id];
    }
    enterLander = () => {
        score.add(500);
        this.despawn();
    }
    static spawn = () =>
    {
        const p_id = `soldier_${++soldierIDs}`;

        let newDiv = document.createElement("div");
        let newImg = document.createElement("img");

        const coordX = getRandomCoordX();
        let coordY = GROUND_HEIGHT;

        newImg.src = soldierIDs % 2 ? 'sprites/soldier_left.png' : 'sprites/soldier_right.png';

        newDiv.className = 'soldier-div';
        newDiv.id = p_id;
        newDiv.style.width = `${SOLDIER_SIZE}px`;
        newDiv.style.height = `${SOLDIER_SIZE}px`;
        newDiv.style.position = 'absolute';
        newDiv.style.left = `${coordX}px`;
        newDiv.style.bottom = `${coordY}px`;   
        newImg.style.width = '100%';

        newDiv.appendChild(newImg);       
        ENEMY_CONTAINER.appendChild(newDiv);

        obj_soldiers[p_id] = new Soldier(p_id, coordX);
    }
    static handle = () => {
        Object.values(obj_soldiers).forEach(s => {
            if (s.dead)
                return;
            else if (s.exploded){
                ++s.exploded;
                if (10 < s.exploded) {
                    s.kill(false);
                    //s.despawn();    
                }
            } 
            else if (s.bearing !== 0) {
                if (!lander.landed){
                    s.bearing = 0;
                }
                else {
                    s.coordX += s.bearing;
                    s.element.style.left = `${s.coordX}px`;
                    if (getDistance(s.getCoords(), lander.getCoords()) < 50)
                        s.enterLander();       
                }
            }
            else if (lander.landed) {
                s.bearing = s.coordX < lander.coordX ? 1 : -1;
                s.flip();          
            }
        });
    }
};
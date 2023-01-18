"use strict";

const PROJECTILE_CONTAINER = document.getElementById('projectile-container');
let projectileIDs = 0;
let obj_projectiles = {};

class Projectile{
    constructor(id, coordX, coordY, bearingX, bearingY){
        this.id = id;
        this.element = document.getElementById(id);
        this.coordX = coordX;
        this.coordY = coordY;
        this.bearingX = bearingX;
        this.bearingY = bearingY;
    }
    getCoords = () => {
        return {'x': this.coordX + (PROJECTILE_SIZE * 0.5), 'y': this.coordY  + (PROJECTILE_SIZE * 0.5) };
    }
    despawn = () => {
        this.element.remove();
        delete obj_projectiles[this.id];
    }
    hitTargetCheck = () => {      
        Object.values(obj_enemies).forEach(e => {
            if (!e.exploded && getDistance(this.getCoords(), e.getCoords()) < PROJECTILE_HIT_RANGE){
                this.despawn();
                e.explode();
                sound_explosion.play();
                score.add(100);
                return true;
            }
        });
        Object.values(obj_soldiers).forEach(s => {
            if (!s.dead && getDistance(this.getCoords(), s.getCoords()) < PROJECTILE_HIT_RANGE){
                this.despawn();
                s.kill(true);
                sound_explosion.play();
                return true;
            }
        });
        return false;
    }
    static spawn = (coordX, coordY, targetCoordX, targetCoordY) =>
    {
        const p_id = `projectile_${++projectileIDs}`;
        const heading = get2DVector({ 'x': coordX, 'y': coordY }, { 'x': targetCoordX, 'y': targetCoordY });
       
        let newDiv = document.createElement("div");
        let newImg = document.createElement("img");

        newDiv.className = 'projectile-div';
        newDiv.id = p_id;
        newDiv.style.width = `${PROJECTILE_SIZE}px`;
        newDiv.style.height = `${PROJECTILE_SIZE}px`;
        newDiv.style.position = 'absolute';
        newDiv.style.left = `${coordX}px`;
        newDiv.style.bottom = `${coordY}px`;   
        newImg.style.width = '100%';
        newImg.src = "sprites/projectile.png";
        newDiv.style.transform = `rotate(${heading}deg)`;
        
        newDiv.appendChild(newImg);       
        PROJECTILE_CONTAINER.appendChild(newDiv);

        const bearing = calculateBearing({ 'x': coordX, 'y': coordY }, { 'x': targetCoordX, 'y': targetCoordY }, PROJECTILE_MAX_SPEED);

        obj_projectiles[p_id] = new Projectile(p_id, coordX, coordY, bearing.x, bearing.y);
    }
    static handle = () => {
        Object.values(obj_projectiles).forEach(p => {
            if (isOutOfGameArea(p.getCoords())){
                p.despawn();   
            }
            else if (p.hitTargetCheck()){
                // continue;
            }
            else {
                p.coordX += p.bearingX;
                p.coordY += p.bearingY;
                p.element.style.left = `${p.coordX}px`;
                p.element.style.bottom = `${p.coordY}px`;
            }
        });  
    }
}
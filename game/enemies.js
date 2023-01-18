"use strict";

const spawnPointDist = 50;  // has to be less than DESPANW_THRESHOLD
const spawnPointNum = 4;    // number of existing spawn points
let enemySpawnTimer = 0;
const enemySpawnPoints = [
    { 'type': 'flying', 'x': -spawnPointDist, 'y': GAME_AREA_HEIGHT + spawnPointDist }, // top left
    { 'type': 'flying', 'x': GAME_AREA_WIDTH + spawnPointDist, 'y': GAME_AREA_HEIGHT + spawnPointDist }, // top right
    { 'type': 'ground', 'x': -spawnPointDist, 'y': GROUND_HEIGHT }, // bottom left
    { 'type': 'ground', 'x': GAME_AREA_WIDTH + spawnPointDist, 'y':GROUND_HEIGHT }, // bottom right
];
Object.freeze(enemySpawnPoints);
const ENEMY_CONTAINER = document.getElementById('enemy-container');
let enemyIDs = 0;
let obj_enemies = {};

class Enemy {
    constructor(id, coordX, coordY, type){
        this.id = id;
        this.element = document.getElementById(id);
        this.type = type;
        this.exploded = 0;
        this.coordX = coordX;
        this.coordY = coordY;
        this.bearing = {
            x: undefined,
            y: undefined,
        };

        if (this.type === 'ground'){                    // IF GROUND ENEMY, THE BEARING IS EITHER LEFT OR RIGHT,
            if (this.coordX < 0)                        // NO NEED TO DYNAMICALLY CALCULATE IT.
                this.bearing.x = GROUND_ENEMY_SPEED;
            else this.bearing.x = -GROUND_ENEMY_SPEED;
            this.bearing.y = 0;
        }
    }
    getCoords = () => {
        return {'x': this.coordX + (ENEMY_SIZE * 0.5), 'y': this.coordY  + (ENEMY_SIZE * 0.5) };
    }
    explode = () => {
        const image = this.element.getElementsByTagName('img');
        this.element.removeChild(image[0]);
        let newImg = document.createElement("img");     
        newImg.src = `sprites/explosion_${Math.floor(Math.random() * 3)}.png`;
        newImg.style.width = '100%';
        this.element.appendChild(newImg);
        this.exploded = 1; 
    }
    despawn = () => {
        this.element.remove();
        delete obj_enemies[this.id];
    }
    static spawn = () =>
    {
        const p_id = `enemy_${++enemyIDs}`;

        let newDiv = document.createElement("div");
        let newImg = document.createElement("img");

        const spawnPoint = enemySpawnPoints[Math.floor(Math.random() * Object.keys(enemySpawnPoints).length)];
        const coordX = spawnPoint.x;
        let coordY = spawnPoint.y;

        if (spawnPoint.type === 'ground')
            newImg.src = (spawnPoint.x < 0) ? 'sprites/enemy_ground_left.png' : 'sprites/enemy_ground_right.png';
        else {
            newImg.src = 'sprites/enemy_flying.png';
            coordY -= Math.floor(Math.random() * GAME_AREA_HEIGHT);
        }

        newDiv.className = 'enemy-div';
        newDiv.id = p_id;
        newDiv.style.width = `${ENEMY_SIZE}px`;
        newDiv.style.height = `${ENEMY_SIZE}px`;
        newDiv.style.position = 'absolute';
        newDiv.style.left = `${coordX}px`;
        newDiv.style.bottom = `${coordY}px`;   
        newImg.style.width = '100%';

        newDiv.appendChild(newImg);       
        ENEMY_CONTAINER.appendChild(newDiv);

        obj_enemies[p_id] = new Enemy(p_id, coordX, coordY, spawnPoint.type);
    }
    hitTargetCheck = () => {      
        Object.values(obj_soldiers).forEach(s => {
            if (getDistance(this.getCoords(), s.getCoords()) < ENEMY_HIT_RANGE_SOLDIER){           
                s.kill(false);
                return;
            }
        });
        if (getDistance(this.getCoords(), lander.getCoords()) < ENEMY_HIT_RANGE_LANDER){
            --lander.health;
            return;
        }
    }
    static handle = () => {
        Object.values(obj_enemies).forEach(e => {
            e.hitTargetCheck();           
            if (e.type === 'flying'){
                e.bearing = calculateBearing(e.getCoords(), lander.getCoords(), FLYNIG_ENEMY_SPEED);            
            }      
            e.coordX += e.bearing.x;
            e.coordY += e.bearing.y;
            e.element.style.left = `${e.coordX}px`;
            e.element.style.bottom = `${e.coordY}px`;
            if (e.exploded){
                ++e.exploded;
                if (10 < e.exploded)
                    e.despawn();
            }        
        });

        ++enemySpawnTimer;
        if (ENEMY_SPAWN_FREQUENCY < enemySpawnTimer){
            enemySpawnTimer = 0;

            Object.values(obj_enemies).forEach(e => {
                if (isOutOfGameArea(e.getCoords())) 
                    e.despawn();
            });

            if (Object.keys(obj_enemies).length < MAX_SPAWNED_ENEMY)
                Enemy.spawn();
        }
    }
}
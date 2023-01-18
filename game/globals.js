"use strict";

// SETTINGS

const UP_KEY = "KeyW";
const DOWN_KEY = "KeyS";
const LEFT_KEY = "KeyA";
const RIGHT_KEY = "KeyD";
const START_KEY = "Space";

const GAME_AREA_HEIGHT = 500;
const GAME_AREA_WIDTH = 800;
const GROUND_HEIGHT = 30;
const DESPAWN_THRESHOLD = 80;

const LANDER_STARTING_HEIGHT = GAME_AREA_HEIGHT + 10;
const LANDER_MAX_VERTICAL_SPEED = 8;
const LANDER_MAX_HORITONTAL_SPEED = 4;
const LANDER_TURN_RATE = 3;
const LANDER_WIDTH = 50;
const LANDER_HEIGHT = 50;
const LANDER_MAX_FUEL = 170;
const LANDER_MAX_HEALTH = 100;

const SOLDIER_SIZE = 50;

const ENEMY_SIZE = 70;
const GROUND_ENEMY_SPEED = 1;
const FLYNIG_ENEMY_SPEED = 2;
const ENEMY_SPAWN_FREQUENCY = 40;
const MAX_SPAWNED_ENEMY = 5;
const ENEMY_HIT_RANGE_LANDER = 400;
const ENEMY_HIT_RANGE_SOLDIER = 400;

const PROJECTILE_SIZE = 30;
const PROJECTILE_MAX_SPEED = 16;
const PROJECTILE_HIT_RANGE = (ENEMY_SIZE - 20) ** 2;      // how close it needs to be to an enemy to explode (VD2)

let gameTimer = 0;

let score = {
    'score':  0,
    'element': document.getElementById('score-display-id'),
    add(amount) {
        console.log(this.element);
        console.log(this.score);
        this.score += amount;
        this.element.innerText = `SCORE ${this.score}`;
    },
    set(amount) {
        this.score = amount;
        this.element.innerText = `SCORE ${this.score}`;
    },
}

const sound_rocket = document.getElementById('sound-rocket');
const sound_ambience = document.getElementById('sound-ambience');
const sound_explosion = document.getElementById('sound-explosion');
const sound_thruster = document.getElementById('sound-thruster');
const sound_alert = document.getElementById('sound-alert');
const sound_button1 = document.getElementById('sound-button1');
const sound_button2 = document.getElementById('sound-button2');
const sound_lander_explosion = document.getElementById('sound-explosion_lander');

// GLOBAL FUNCTIONS

const getDistance = (coordsA, coordsB) => ((coordsB.x-coordsA.x) ** 2) + ((coordsB.y-coordsA.y) ** 2);

const get2DVector = (coordsA, coordsB) => {
    const deltaX = coordsB.x - coordsA.x;
    const deltaY = coordsB.y - coordsA.y;
    return Math.atan2(deltaX, deltaY) / Math.PI * 180;
}
const gameCoordsToScreenPos = (coordX, coordY) => {
    const posLeft = `${gameArea.bounds.left + coordX}px`;
    const posBottom = `${gameArea.bounds.bottom + coordY}px`;
    return { 'x': posLeft, 'y': posBottom };
}
const isOutOfGameArea = (coords) => {
    if (coords.y < gameArea.despawnArea.bottom
    || gameArea.despawnArea.top < coords.y
    || coords.x < gameArea.despawnArea.left
    || gameArea.despawnArea.right < coords.x)
        return true;
    return false;
}
const calculateBearing = (coords, target, maxSpeed) => {
    let bearingX = target.x - coords.x;
    let bearingY = target.y - coords.y;

    while (true){
        bearingX *= 0.5;
        bearingY *= 0.5;

        let x = Math.abs(bearingX);
        let y = Math.abs(bearingY);

        if (x < maxSpeed && y < maxSpeed)
            break;
    }
    return { 'x': bearingX, 'y': bearingY };
}
const getRandomCoordX = (randDist = 250) => (GAME_AREA_WIDTH * 0.5) - randDist + (Math.floor(Math.random() * (randDist * 2)));

const backgroundElement = document.getElementById('background-div');
backgroundElement.textContent = "PRESS 'SPACE' TO START";
backgroundElement.style.fontSize = '30px';
backgroundElement.style.textAlign = 'center';
backgroundElement.style.lineHeight = '500px';
const setBackground = (show) => {
    if (show) {
        backgroundElement.textContent = '';
        let newImg = document.createElement("img");
        newImg.src = `sprites/background_${Math.floor(Math.random() * 3)}.png`;
        newImg.id = 'game-background-img-id';
        newImg.style.width = `100%`;
        newImg.style.height = `100%`;
        backgroundElement.appendChild(newImg);      
    }
    else {
        const image = document.getElementById('background-div').getElementsByTagName('img');
        backgroundElement.removeChild(image[0]);
        backgroundElement.textContent = "PRESS 'SPACE' TO START";
    }
}
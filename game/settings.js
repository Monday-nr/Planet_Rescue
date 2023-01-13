// SETTINGS
const UP_KEY = "KeyW";
const DOWN_KEY = "KeyS";
const LEFT_KEY = "KeyA";
const RIGHT_KEY = "KeyD";
const LANDER_STARTING_HEIGHT = 600;
const LANDER_MAX_VERTICAL_SPEED = 8;
const LANDER_MAX_HORITONTAL_SPEED = 4;
const LANDER_TURN_RATE = 3;
const LANDER_WIDTH = 50;
const LANDER_HEIGHT = 50;
const GAME_AREA_HEIGHT = 600;
const GAME_AREA_WIDTH = 800;
const GROUND_HEIGHT = 10;


// GLOBAL FUNCTIONS
const getDistance = (coordsA, coordsB) => ((coordsB.x-coordsA.x) ** 2) + ((coordsB.y-coordsA.y) ** 2);

const getVector = (coordsA, coordsB) => {
    const deltaX = coordsB.x - coordsA.x;
    const deltaY = coordsB.y - coordsA.y;
    return Math.atan2(deltaX, deltaY) / Math.PI * 180;
}
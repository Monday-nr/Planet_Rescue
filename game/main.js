"use strict";

// SETTING UP GAME AREA
const gameArea = {
    id: document.getElementById('game-area-id'),
    bounds: document.getElementById('game-area-id').getBoundingClientRect(),
    width: GAME_AREA_WIDTH,
    height: GAME_AREA_HEIGHT,
    despawnArea: {
        top: GAME_AREA_HEIGHT + DESPAWN_THRESHOLD,
        bottom: -DESPAWN_THRESHOLD,
        left: -DESPAWN_THRESHOLD,
        right: GAME_AREA_WIDTH + DESPAWN_THRESHOLD,
    },
};
Object.freeze(gameArea);
gameArea.id.style.width = gameArea.width;
gameArea.id.style.height = gameArea.height;

// EVENT LISTENERS / LANDER CONTROLS
document.addEventListener("keypress", event => {
    switch(event.code){
    case UP_KEY:
        lander.thrusting = true;      
        break;
    case LEFT_KEY:
        if (!lander.landed)
            lander.turning = 'left';
        break;
    case RIGHT_KEY:
        if (!lander.landed)
            lander.turning = 'right';
        break;
    }
});
document.addEventListener("keyup", event => {
    switch(event.code){
    case UP_KEY:
        lander.thrusting = false;    
        break;
    case LEFT_KEY:
        lander.turning = '';
        break;
    case RIGHT_KEY:
        lander.turning = '';
        break;
    case START_KEY:
        console.log('start pressed');
        console.log(gameStage);
        if (gameStage === 'paused')
            gameStage = 'start';
        break;
  }
});
gameArea.id.addEventListener("click", event => {
    const clickCoordX = event.clientX - gameArea.bounds.left;
    const clickCoordY = GAME_AREA_HEIGHT - (event.clientY - gameArea.bounds.top);
    lander.fireProjectile(clickCoordX, clickCoordY);
});

// UI

const FUEL_METER = document.getElementById('fuel-meter');

// GAME LOGIC

let gameStage = 'paused';

const startGame = () =>{
    score.set(0);
    sound_ambience.play();
    setBackground(true);
    Lander.spawn();
    Soldier.spawn();
    Soldier.spawn();
    gameStage = 'playing';
}
const resetGame = () => {
    setBackground(false);
    Object.values(obj_soldiers).forEach(s => s.despawn());
    Object.values(obj_enemies).forEach(e => e.despawn());
    Object.values(obj_projectiles).forEach(p => p.despawn());
    lander.despawn();
    gameStage = 'paused';
}
const game = () =>
{
    switch (gameStage){
        case 'start':
            startGame();
            break;
        case 'paused':
            return;
        case 'reset':
            resetGame();
            break;
        case 'playing':
            ++gameTimer;
            lander.handle();  
            Projectile.handle();
            Enemy.handle();
            Soldier.handle();
            break;
    }
}

window.onload = () => setInterval(game, 50);



const startButton = document.getElementById('start-button');
startButton.addEventListener('click', () => startGame());




// SETTING UP GAME AREA
const gameArea = {
    id: document.getElementById('game-area-id'),
    bounds: document.getElementById('game-area-id').getBoundingClientRect(),
    width: GAME_AREA_WIDTH,
    height: GAME_AREA_HEIGHT,
};
gameArea.id.style.width = gameArea.width;
gameArea.id.style.height = gameArea.height;

//const gameArea = document.getElementById('game-area-id');
//const gameAreaBound = gameArea.getBoundingClientRect();
const gameRow = document.getElementById('game-row-id');
const projectile = document.getElementById('projectile-id');


// EVENT LISTENERS / LANDER CONTROLS
document.addEventListener("keypress", event => {
    switch(event.code){
    case UP_KEY:
        console.log('start thrusting');
        lander.thrusting = true;
        break;
    case LEFT_KEY:
        console.log('start turning left');
        if (!lander.landed)
            lander.turning = 'left';
        break;
    case RIGHT_KEY:
        console.log('start turning right');
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
  }
});
gameArea.id.addEventListener("click", event => {
    const clickCoordX = event.clientX - gameArea.bounds.left;
    const clickCoordY = GAME_AREA_HEIGHT - (event.clientY - gameArea.bounds.top);
    lander.fireProjectile(clickCoordX, clickCoordY);
});

// GAME LOGIC
function game()
{
    
    



    lander.setPosition();
    if (lander.turning != '')
        lander.rotate();

}








window.onload = function(){
  setInterval(game, 50);
}
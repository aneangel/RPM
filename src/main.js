// Anthony Angeles
// Rocket Patrol: the fast and the furious
// Time Taken: 5 hrs
// Mods:
// Particles 5pts
// Faster spaceship: 5pts
// Time addition after each collision: 5pts
// Displaying time: 3pts


let config = {
    type: Phaser.CANVAS,
    width: 640,
    height: 480,
    scene: [ Menu, Play ]
}

let game = new Phaser.Game(config);

// UI
let borderUISize = game.config.height / 15;
let borderPadding = borderUISize / 3;

// Keyboard Controls
let keyF, keyR, keyLEFT, keyRIGHT;
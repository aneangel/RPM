class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload() {
        //load images
        this.load.image('rocket', './assets/rocket.png');
        this.load.image('spaceship', './assets/spaceship.png');
        this.load.image('fastShip', './assets/fastShip.png');
        this.load.image('starfield', './assets/starfield.png');
        this.load.image('particle', './assets/particle.png')

        //load sprite
        this.load.spritesheet('explosion', './assets/explosion.png',
            {
                frameHeight: 32, startFrame: 0, frameWidth: 64, endFrame: 9
            });
    }
    create() {
        // title sprite
        this.starfield = this.add.tileSprite(0, 0, 640, 480, 'starfield').setOrigin(0, 0)
        // green UI background
        this.add.rectangle(0, borderUISize + borderPadding, game.config.width,
            borderUISize * 2, 0x00FF00).setOrigin(0, 0);

        // white borders
        this.add.rectangle(0, 0, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(0, game.config.height - borderUISize, game.config.width,
            borderUISize, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(0, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(game.config.width - borderUISize, 0,
            borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0);

        this.p1Rocket = new Rocket(this, game.config.width/2,
            game.config.height - borderUISize -borderPadding, 'rocket').setOrigin(0.5, 0);

        // add spaceships (x3)
        this.ship01 = new Spaceship(this, game.config.width + borderUISize*6, borderUISize*4, 'spaceship', 0, 30, 3).setOrigin(0, 0);
        this.ship02 = new Spaceship(this, game.config.width + borderUISize*3, borderUISize*5 + borderPadding*2, 'spaceship', 0, 20, 3).setOrigin(0,0);
        this.ship03 = new Spaceship(this, game.config.width, borderUISize*6 + borderPadding*4, 'fastShip', 0, 50, 10).setOrigin(0,0);

        //define keys
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion', {
                start: 0, end: 9, first: 0
            }),
            frameRate: 30
        });

        this.p1Score = 0;

        let scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100
        }

        this.scoreLeft = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding * 2,
            this.p1Score, scoreConfig);

        this.gameOver = false;

        scoreConfig.fixedWidth = 0;

        // this.clock = this.time.delayedCall(game.settings.gameTimer, () => {
        //     this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', scoreConfig).setOrigin(0.5);
        //     this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press (R) to Restart or <- to Menu', scoreConfig).setOrigin(0.5);
        //     this.gameOver = true;
        // }, null, this);


        this.gameClock = game.settings.gameTimer;
        // create an object to populate the text configuration members
        let gameClockConfig =
            {
                fontFamily: "Courier",
                fontSize: "20px",
                backgroundColor: "#f3b141",
                color: "#843605",
                align: "left",
                padding: {top: 5, bottom: 5},
                fixedWidth: 140
            };
        // add the text to the screen
        this.timeLeft = this.add.text
        (
            400, // x-coord
            54, // y-coord
            "Timer: " + this.formatTime(this.gameClock), // text to display
            gameClockConfig // text style config object
        );
        // add the event to decrement the clock
        // code adapted from:
        //  https://phaser.discourse.group/t/countdown-timer/2471/3
        this.timedEvent = this.time.addEvent
        (
            {
                delay: 1000,
                callback: () =>
                {
                    if (!this.gameOver) {
                        this.gameClock -= 1000;
                        this.timeLeft.text = "Timer: " +
                            this.formatTime(this.gameClock);
                    }
                },
                scope: this,
                loop: true
            }
        );

    }

    update() {
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyR)) {
            this.scene.restart();
        }

        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.scene.start("menuScene");
        }

        this.starfield.titlePositionX -= 4;

        if (!this.gameOver) {
            this.p1Rocket.update();
            //update spaceships
            this.ship01.update();
            this.ship02.update();
            this.ship03.update();
        }

        if (this.checkCollision(this.p1Rocket, this.ship03)) {
            this.gameClock = this.gameClock + 30000;
            this.p1Rocket.reset();
            this.particle(this.ship03)
            this.shipExplode(this.ship03);
        }
        if (this.checkCollision(this.p1Rocket, this.ship02)) {
            this.gameClock = this.gameClock + 30000;
            this.p1Rocket.reset();
            this.particle(this.ship02)
            this.shipExplode(this.ship02);
        }
        if (this.checkCollision(this.p1Rocket, this.ship01)) {
            this.gameClock = this.gameClock + 30000;
            this.p1Rocket.reset();
            this.particle(this.ship01)
            this.shipExplode(this.ship01);
        }

        if (this.gameClock === 0) {
            this.gameClock = 0; // Ensure the timer doesn't go below 0

            // Display "GAME OVER" text
            this.add.text(game.config.width / 2, game.config.height / 2, 'GAME OVER', scoreConfig).setOrigin(0.5);
            this.add.text(game.config.width / 2, game.config.height / 2 + 64, 'Press (R) to Restart or <- to Menu', scoreConfig).setOrigin(0.5);
            this.gameOver = true;

            // // Add the delayed event for game over
            // this.time.delayedCall(game.settings.gameTimer, () => {
            //     this.scene.restart();
            // }, null, this);

        }
    }

    checkCollision(rocket, ship) {
        return rocket.x < ship.x + ship.width &&
            rocket.x + rocket.width > ship.x &&
            rocket.y < ship.y + ship.height &&
            rocket.height + rocket.y > ship.y;
    }

    shipExplode(ship) {
        ship.alpha = 0;

        let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0, 0);
        boom.anims.play('explode');
        boom.on('animationComplete', () => {
            ship.reset();
            ship.alpha = 1;
            boom.destroy();
        });

        this.p1Score += ship.points;
        this.scoreLeft.text = this.p1Score;

        this.sound.play('sfx_explosion');
    }

    formatTime(ms)
    {
        let s = ms/1000;
        let min = Math.floor(s/60);
        let seconds = s%60;
        seconds = seconds.toString().padStart(2, "0");
        return `${min}:${seconds}`;
    }

    particle(ship) {
        this.add.particles(ship.x, ship.y, 'particle', {
            speed: 200,
            lifespan: 150,
            quantity: 3,
            duration: 300,
            maxParticles: 5
        })
    }
}
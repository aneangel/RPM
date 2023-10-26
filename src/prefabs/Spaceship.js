//spaceship prefab

class Spaceship extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame, pointValue, speed) {
        super(scene, x, y, texture, frame, speed);

        scene.add.existing(this);
        this.points = pointValue;
        this.moveSpeed = speed;
        // this.defualtSpeed = game.settings.spaceshipSpeed;
    }

    update() {
        //move spaceship left
        this.x -= this.moveSpeed;

        //wrap around left edge to right edge
        if (this.x <= 0 - this.width) {
            this.reset();
        }
    }

    reset() {
        this.x = game.config.width;
    }
}
// @ts-nocheck

class RocketLauncher {

    /**
     * 
     * @param {Player | Enemy} source 
     */
    constructor(source) {
        this.source = source;
        this.launchEvents = [];
    }

    /**
     * Sets the rocket launcher operation
     * @param {number} rocketType Type of rocket, only affects its appearance.
     * @param {CallableFunction} fireType Way of firing rockets.
     * @param {number} rate Fire Rate, Rockets are fired every 100/rate seconds.
     * @param {number} number Number of rockets fired at once.
     * @param {number} velocity Rockets velocity.
     */
    setOperation(rocketType, fireType, rate, number, velocity, target = 0) {
        this.launchEvents.push(
            this.source.scene.time.addEvent({
                delay: 100000.0 / rate,
                callback: fireType,
                callbackScope: this,
                loop: true,
                args: [rocketType, number, velocity, target]
            })
        )
    }

    launchStraight(rocketType, number, velocity, target) {
        var rotation = target ? this.source.rotationToPlayer() + Math.PI / 2 : this.source.rotation;
        var range = this.source.body.width;
        var positionStep = {
            x: range / number * Math.cos(rotation),
            y: range / number * Math.sin(rotation)
        };
        var startingPosition = {
            x: this.source.x - range / 2 * Math.cos(rotation) + 0.5 * positionStep.x,
            y: this.source.y - range / 2 * Math.sin(rotation) + 0.5 * positionStep.y
        };
        for (let i = 0; i < number; i++)
            new Rocket(
                this.source,
                rocketType,
                startingPosition.x + i * positionStep.x,
                startingPosition.y + i * positionStep.y,
                rotation,
                velocity
            );
    }

    launchArc(rocketType, number, velocity, target) {
        var rotationStep = Math.PI / Math.max(number * 2, 18); // 10 degrees difference, max 90 degrees arc.
        var startingRotation = (target ? this.source.rotationToPlayer() + Math.PI / 2 : this.source.rotation) - rotationStep * (number * 0.5 - 0.5);
        for (let i = 0; i < number; i++)
            new Rocket(
                this.source,
                rocketType,
                this.source.x,
                this.source.y,
                startingRotation + i * rotationStep,
                velocity
            );

    }

    launch360(rocketType, number, velocity, target) {
        var rotationStep = (Math.PI * 2 / number);
        var startingRotation = target ? this.source.rotationToPlayer() + Math.PI / 2 : this.source.rotation;
        for (let i = 0; i < number; i++)
            new Rocket(
                this.source,
                rocketType,
                this.source.x,
                this.source.y,
                startingRotation + i * rotationStep,
                velocity
            );
    }

    launchRandom(rocketType, number, velocity, target) {
        var random = Phaser.Math.FloatBetween(0, 3);
        if (random < 1) this.launchStraight(rocketType, number, velocity, target);
        else if (random < 2) this.launchArc(rocketType, number, velocity, target);
        else this.launch360(rocketType, number, velocity, target);
    }

    destroy() {
        this.launchEvents.forEach((event) => event.remove());
    }

}
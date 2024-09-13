var currentScene = null;

const
    showScene = (scene) => {
        currentScene = scene;
        currentScene.initialise();
    },
    
    processInput = () => {
        if (!shipIsAlive) { ship.position.z += speed; }
        else {
            ship.rotation.z += -ship.rotation.z * deltaTime * 5;
            ship.position.z += 10 * speed;

            if (leftKeyPressed) {
                ship.position.x -= speed;
                if (ship.rotation.z < .8) ship.rotation.z += (.8 - ship.rotation.z) * speed;
            }

            if (rightKeyPressed) {
                ship.position.x += speed;
                if (ship.rotation.z > -.8) ship.rotation.z += (-.8 - ship.rotation.z) * speed;
            }

            if (upKeyPressed) ship.position.y += speed;
            if (downKeyPressed) ship.position.y -= speed;

            if (spaceKeyPressed && canShoot) {
                if (elapsedTime - lastFired > .2) {
                    playFX(laser);
                    missileCount++;
                    if (missileCount >= 13)
                        canShoot = false;
                    shootMissles(ship.position, ship.rotation);
                    lastFired = elapsedTime;
                }
            }
        }

        camera.position = v3Lerp(camera.position, v3Sub(ship.position, v3(0, -2, 2)), 0.075);
    },

    explodeShip = () => {
        playFX(explosion);
        initiliseTerminalText([
            { text: ["          MISSION FAILED", "      PRESS ENTER TO RESTART",], duration: 200 },
        ]);
        terminalTextLinesTop = 180;
        addExplosion(ship.position);
        meshes.splice(meshes.indexOf(ship), 1);
        shipIsAlive = false;
    }

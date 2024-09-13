var
    trainingScene = () => ({
        initialise: initialiseTrainingScene,
        update: updateTrainingScene
    }),
    ship,
    shipIsAlive,
    lastFired,
    levelWals,
    levelObstacles,
    missileCount,
    canShoot,
    missionSucceeded,
    speed

initialiseTrainingScene = () => {

    elapsedTime = 0;
    shipIsAlive = true;
    lastFired = 0;
    missileCount = 0;
    canShoot = true;
    missionSucceeded = false;

    initiliseTerminalText([
        { text: ["            MISSION 01", "  OBSTACLES AVOIDANCE TRAINING",], duration: 4 },
        { text: ["     USE WASD OR ARROW KEYS", "       TO STEER THE SHIP!",], duration: 4 },
    ]);
    terminalTextLinesTop = 180;

    meshes = [];
    ship = loadMesh(shipGeometry, v3(0, 1, 0));
    meshes.push(ship);

    levelWals = [];
    levelObstacles = [];
    let i = 0;
    while (i < 15) {
        tunel = loadMesh(tunelGeometry, v3(0, 0, i * 20), v3(0, 0, 0), v3(10, 10, 10));
        levelWals.push(tunel);
        meshes.push(tunel);

        const obstacleSize = random() * 2 + 2;
        const obstacle = loadMesh(obstacleGeometry, v3(random() < .5 ? random() * 18 : -random() * 18, random() < .5 ? random() * 12 : -random() * 12, i * 50 + 1300), v3(0, 0, 0), v3(obstacleSize, obstacleSize, obstacleSize));
        obstacle.rotationSpeed = v3(random(), random(), random());
        obstacle.Yspeed = Math.random() > .5 ? 1 : -1;
        meshes.push(obstacle);
        levelObstacles.push(obstacle);

        i++
    }
},

    updateTrainingScene = () => {
        speed = 15 * deltaTime;
        processInput();

        if (!shipIsAlive && enterKeyPressed) {
            if (missionSucceeded)
                showScene(missionBriefingScene())
            else
                initialiseTrainingScene();
            return;
        }

        if ((ship.position.x < -18 || ship.position.x > 18 || ship.position.y < -10 || ship.position.y > 10) && shipIsAlive) {
            explodeShip();
        }

        // update level wals
        let i = 0, item, length = levelWals.length;
        while (i < length) {
            item = levelWals[i]
            if (item.position.z < ship.position.z - 25)
                item.position.z += 300;
            i++;
        }
        // update level obstacles
        i = 0, length = levelObstacles.length;
        while (i < length) {
            item = levelObstacles[i];
            item.rotation = v3Add(item.rotation, v3Multiply(item.rotationSpeed, deltaTime));

            if (item.position.z < ship.position.z - 25)
                item.position.z += 750;

            item.position.y += item.Yspeed * deltaTime * 10;
            if (item.position.y > 12) item.Yspeed = -1;
            if (item.position.y < -12) item.Yspeed = 1;

            i++;
        }

        setCollisionBox(ship);
        levelObstacles.forEach(obstacle => {
            setCollisionBox(obstacle);
            if (shipIsAlive && intersect(obstacle, ship)) {
                explodeShip();
            }
        });

        particles.forEach(particle => {
            if (particle.canColide) {
                setCollisionBox(particle);
                levelObstacles.forEach(obstacle => {
                    if (intersect(obstacle, particle)) {
                        obstacle.position.z += 750;
                        particles.splice(particles.indexOf(particle), 1);
                        meshes.splice(meshes.indexOf(particle), 1);
                        playFX(collision);
                    }
                })
            }
        })

        if (ship.position.z > 5000 && shipIsAlive) {
            shipIsAlive = false;
            missionSucceeded = true
            initiliseTerminalText([
                { text: ["        MISSION SUCCEEDED", "       WELL DONE COMMANDER",], duration: 5 },
                { text: ["       PRESS ENTER TO START", "           NEXT MISSION",], duration: 5 },
            ]);
            terminalTextLinesTop = 180;
        }
        drawMissiles();
    },


    drawMissiles = () => {
        for (let i = 0; i < 13 - missileCount; i++) {
            beginPath();
            context.rect(180 + i * 10, 470, 5, 5);
            fill();
        }
    }
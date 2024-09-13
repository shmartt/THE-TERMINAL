var spaceScene = () => ({
    initialise: initialiseSpaceScene,
    update: updateSpaceScene
}),
    stars = [],
    asteroids = [],
    starsCanvas = null,
    moon,
    ufo,
    ufoRadius,
    ufoLastFired,
    ufoIsAlive,

    initialiseSpaceScene = () => {
        elapsedTime = 0;

        stars = [];
        meshes = [];
        asteroids = [];
        particles.length = 0;

        shipIsAlive = true;
        lastFired = 0;
        missileCount = 0;
        canShoot = true;
        missionSucceeded = false;

        ufoRadius = random() * 10;
        ufoLastFired = 0;
        ufoIsAlive = true;

        initiliseTerminalText([
            { text: ["            MISSION 02", "         DESTROY THE UFO",], duration: 4 },
            { text: ["      YOU HAVE ONLY 12 LASER", "         BASED MISSILES"], duration: 4 },
        ]);
        terminalTextLinesTop = 180;

        let i = 0;
        while (i < 100) {
            let star = plane(.1, .1, v3(20 * random() * (random() < .5 ? -1 : 1), 20 * random() * (random() < .5 ? -1 : 1), i * 2), white);
            meshes.push(star);
            stars.push(star);
            let asteroidSize = random() + .5;
            let asteroid = loadMesh(asteroidGeometry,
                v3(20 * random() * (random() < .5 ? -1 : 1), 20 * random() * (random() < .5 ? -1 : 1), i * 20 + 1999),
                v3(random() * PI, random() * PI, random() * PI),
                v3(asteroidSize, asteroidSize, asteroidSize)
            );
            meshes.push(asteroid);
            asteroids.push(asteroid);

            i++
        }

        ufo = loadMesh(ufoGeometry, v3());
        moon = loadMesh(moonGeometry, v3(), v3(), v3(10, 10, 10));
        ship = loadMesh(shipGeometry, v3(0, 1, 0));

        meshes.push(ship, moon, ufo);

        drawBackgroundStars();
    },

    updateSpaceScene = () => {

        context.drawImage(starsCanvas, 0, 0);

        speed = 15 * deltaTime;

        if ((!shipIsAlive || !ufoIsAlive) && enterKeyPressed) {
            if (missionSucceeded) {
                showScene(moonScene())
            }
            else {
                initialiseSpaceScene();
            }
        }

        if (missionSucceeded) return;
        processInput();


        if (ufoIsAlive && elapsedTime > 8) {
            ufo.position.z = ship.position.z + 50 - ufoRadius;
            if (elapsedTime % 6 > 5.9) ufoRadius = random() * 10;
            let ufoAngle = elapsedTime % (2 * PI);
            ufo.position = v3(ufoRadius * cos(ufoAngle), ufoRadius * sin(ufoAngle), ufo.position.z)
            ufo.rotation.y += deltaTime * 3;

            if (elapsedTime - ufoLastFired > 1) {
                playFX(laser);
                shootProjectile(ufo.position, ship.position);
                ufoLastFired = elapsedTime;
            }

            setCollisionBox(ufo);
            particles.forEach(particle => {
                if (particle.canColide && !particle.isEnemyBullet) {
                    setCollisionBox(particle);
                    if (intersect(particle, ufo)) {
                        addExplosion(ufo.position);
                        ufoIsAlive = false;
                        missionSucceeded = true;
                        initiliseTerminalText([
                            { text: ["        MISSION SUCCEEDED"], duration: 5 },
                            { text: ["       PRESS ENTER TO START", "           NEXT MISSION",], duration: 5 },
                        ]);
                        terminalTextLinesTop = 180;
                        meshes.splice(meshes.indexOf(ufo), 1);
                    }
                }
            })
        }

        let i = 0, item, length = stars.length;
        while (i < length) {
            item = stars[i]
            if (item.position.z < ship.position.z - 25)
                item.position.z += 200;
            i++;
        }

        if (ship.position.z < 5000) {
            setCollisionBox(ship);
            i = 0, length = asteroids.length;
            while (i < length) {
                item = asteroids[i];
                item.rotation.x += item.rotation.z * deltaTime;
                if (item.position.z < ship.position.z - 25)
                    item.position.z += 2000;

                setCollisionBox(item);
                if (shipIsAlive && intersect(item, ship)) {
                    explodeShip();
                }

                particles.forEach(particle => {
                    if (particle.canColide) {
                        setCollisionBox(particle);
                        if (intersect(item, particle)) {
                            item.position.z += 750;
                            particles.splice(particles.indexOf(particle), 1);
                            meshes.splice(meshes.indexOf(particle), 1);
                            playFX(collision);
                        }

                    }
                })

                i++;
            }
        }


        if (shipIsAlive) {
            if (ship.position.x < -16) ship.position.x = -16;
            if (ship.position.x > 16) ship.position.x = 16;
            if (ship.position.y < -16) ship.position.y = -16;
            if (ship.position.y > 16) ship.position.y = 16;
        }

        drawMissiles();

        moon.position.z = ship.position.z + 250;
    },

    drawBackgroundStars = () => {
        starsCanvas = document.createElement('canvas');
        starsCanvas.width = 480;
        starsCanvas.height = 480;
        starsContext = starsCanvas.getContext("2d");
        starsContext.fillStyle = white;
        starsContext.beginPath();
        for (let i = 0; i < 300; i++) {
            starsContext.rect(random() * 480, random() * 480, 1, 1);
        }
        starsContext.fill();
    }
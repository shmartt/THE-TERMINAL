var moonScene = () => ({
    initialise: initialiseMoonScene,
    update: updateMoonScene
}),
    starsCircle,
    base,
    baseDistance,
    baseIsHit,
    baseHealth = 100,
    healthBar,
    baseExploded

initialiseMoonScene = () => {
    starsCircle = {};
    elapsedTime = 0;
    shipIsAlive = true;
    lastFired = 0;
    missileCount = 0;
    canShoot = true;
    missionSucceeded = false;

    baseDistance = random() * 50 + 50;
    baseIsHit = false;
    baseExploded = false;

    ufoRadius = random() * 10;
    ufoLastFired = 0;
    ufoIsAlive = true;

    initiliseTerminalText([
        { text: ["          AREA 13 MISSION", "         DESTROY THE BASE!"], duration: 6 },
    ]);
    terminalTextLinesTop = 180;

    meshes = [];
    levelWals = [];
    healthBar = plane(10, 1, v3())
    let i = 0;
    while (i < 30) {
        for (let x = -8; x < 8; x++) {
            let moonRadius = 50;  // Adjust this value for the size of the moon curve
            let angle = (x * 2) / moonRadius;  // Convert x position to an angle
            let y = Math.sin(angle) * moonRadius;  // Calculate y position to simulate the curve

            let floorPlane = plane(.1, .2, v3(x * 2, sin(x / PI) * x / 2, i * 5), aqua);
            meshes.push(floorPlane);
            levelWals.push(floorPlane);
        }
        i++
    }
    ufo = loadMesh(ufoGeometry, v3());

    ship = loadMesh(shipGeometry, v3(0, 1, 0));
    base = loadMesh(baseGeometry, v3(0, 1, 0));

    meshes.push(ship, base, healthBar, ufo);
    createStarsCircle();
},

    updateMoonScene = () => {
        speed = 5 * deltaTime;

        if (elapsedTime % 3 > 2.8) baseDistance = random() * 100 + 50;


        processInput();


        base.position.z = ship.position.z + baseDistance;
        base.position.y = cos(elapsedTime) * deltaTime * 200 + 5;
        healthBar.position = v3Add(base.position, v3(0, 5, 0));
        healthBar.scale.x = baseHealth / 100;

        if (baseHealth < 0 && !baseExploded) {
            addExplosion(base.position);
            meshes.splice(meshes.indexOf(base), 1);
            meshes.splice(meshes.indexOf(healthBar), 1);
            baseExploded = true;
            shipIsAlive = false;
            ufoIsAlive = false
            initiliseTerminalText([
                { text: ["      AREA 13 BASE DISTROYED!", "        WELL DONE COMMANDER!"], duration: 10 },
                { text: ["      YOU CAN NOW PLAY OTHER", "    GAMES FROM JS13K COMPETITION"], duration: 10 },

            ]);
            terminalTextLinesTop = 180;
        }
        if (baseIsHit && elapsedTime % 1 > .9) { baseIsHit = false; base.color = magenta }

        if (baseIsHit) base.color = random() > .5 ? magenta : aqua;
        ///     camera.position = v3Lerp(camera.position, v3Sub(ship.position, v3(0, -5, 5)), 0.0001);

        if (ship.position.x < -8) ship.position.x = -8;
        if (ship.position.x > 6) ship.position.x = 6;
        if (ship.position.y < 0) ship.position.y = 0;
        if (ship.position.y > 8) ship.position.y = 8;


        // update level wals
        let i = 0, item, length = levelWals.length;
        while (i < length) {
            item = levelWals[i]
            if (item.position.z < ship.position.z - 25)
                item.position.z += 150;
            i++;
        }

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
                        meshes.splice(meshes.indexOf(ufo), 1);
                    }
                }
            })
        }

        // update starscircle
        if (!starsCircle.isColapsing) {
            starsCircle.x += starsCircle.speed * deltaTime;
            if (starsCircle.x > 10) starsCircle.speed = -10;
            if (starsCircle.x < -10) starsCircle.speed = 10;
        }
        else {
            starsCircle.x = ship.position.x;
            starsCircle.y = ship.position.y;
            if (starsCircle.radius > .5) starsCircle.radius -= .5;
        }

        if (starsCircle.z < ship.position.z - 5) createStarsCircle();

        for (let i = 0; i < starsCircle.stars.length; i++) {
            let star = starsCircle.stars[i];
            star.angle += .03;
            star.position = v3(starsCircle.x + starsCircle.radius * cos(star.angle), starsCircle.y + starsCircle.radius * sin(star.angle), starsCircle.z);
            star.rotation.z = star.angle;
        }

        setCollisionBox(ship);
        if (ship.min.x > starsCircle.x - starsCircle.radius && ship.max.x < starsCircle.x + starsCircle.radius &&
            ship.min.y > starsCircle.y - starsCircle.radius && ship.max.y < starsCircle.y + starsCircle.radius &&
            ship.min.z < starsCircle.z && ship.max.z > starsCircle.z) {
            starsCircle.isColapsing = true;
            missileCount = 0;
            canShoot = true;
            playFX(terminalNoSound);
        }

        setCollisionBox(base);


        particles.forEach(particle => {
            if (particle.canColide) {
                setCollisionBox(particle);
                if (intersect(base, particle)) {
                    baseIsHit = true;
                    baseHealth -= 2;
                    particles.splice(particles.indexOf(particle), 1);
                    meshes.splice(meshes.indexOf(particle), 1);
                    playFX(collision);

                }

            }
        })

        drawMissiles();
    },

    createStarsCircle = () => {
        if (starsCircle.stars !== undefined) {
            starsCircle.stars.forEach(star => {
                meshes.splice(meshes.indexOf(star), 1);
            })
        }
        starsCircle = {};
        let x = random() * 10 * (random() > .5 ? -1 : 1);
        let y = random() * 5;
        let z = ship.position.z + 500;
        let radius = random() * 3 + 2;
        starsCircle.stars = [];
        for (let i = 0; i < PI * 2; i += PI / 3) {
            let triangle = loadMesh(triangleGeometry, v3(radius * cos(i) + x, radius * sin(i) + y, z), v3(0, 0, i), v3(.3, .3, .3));
            triangle.angle = i;
            meshes.push(triangle)
            starsCircle.stars.push(triangle);
        }
        starsCircle.x = x;
        starsCircle.y = y;
        starsCircle.z = z;
        starsCircle.radius = radius;
        starsCircle.speed = 10;
        starsCircle.isColapsing = false;
    }
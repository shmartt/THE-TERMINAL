var
    introScene = () => ({
        initialise: initialiseIntroScene,
        update: updateIntroScene
    }),
    pilotHelmet,
    pilotBody,
    ship,
    shipIsShwon,
    lunaLogo,
    pilotIsShwon,
    targetPosition = v3(0, 1, 15),
    targetRotation = v3(0, 0, 0),
    smoothFactor = 0.05,

    initialiseIntroScene = () => {
        elapsedTime = 0;
        shipIsShwon = false;
        pilotIsShwon = false;
        meshes = [];
        pilotHelmet = loadMesh(pilotHelmetGeometry, v3(0, 0, 15))
        pilotBody = loadMesh(pilotBodyGeometry, v3(0, 0, 15))
        ship = loadMesh(shipGeometry, v3(0, 1, 15), v3(0, 0, 0))
        lunaLogo = loadMesh(lunaLogoGeometry, v3(0, 0, 0), v3(-PI / 2, PI, 0))

        meshes.push(lunaLogo);
        addTween(lunaLogo, v3(0, 0, 20), v3(0, PI, 0), 2)

        initiliseTerminalText([
            { text: ["Welcome to the TOP SECRET program", "LUNA, commander! This NACA", "program is the future of", "avionics."], duration: 15 },
            { text: ["LUNA squadron is using the latest", "USA technologies to intercept the", "possible encounters with other", "entities on future missions", "to the moon."], duration: 15 },
            { text: ["This terminal is used to train", "you on the new Northrop AURORA", "aeronautics systems."], duration: 15 },
            { text: ["AURORA is a big leap ahead in", "propulsion and weaponry."], duration: 15 },
            { text: ["Instantaneous acceleration and", "directed-energy weapon that uses", "lasers to inflict damage are just", "some of its characteristics."], duration: 15 },
            { text: ["Remember! Use WASD or arrow keys", "to steer and space to fire.", "Please always remain calm and", "distroy everything in your way!"], duration: 200 },

        ], trainingScene());
        terminalTextLinesTop = 340;
    },

    updateIntroScene = () => {

        if (terminalQueueIndex === 1 && !pilotIsShwon) {
            meshes = [];
            meshes.push(pilotBody, pilotHelmet);
            pilotIsShwon = true;
        }

        if (terminalQueueIndex === 3 && !shipIsShwon) {
            meshes = [];
            meshes.push(ship);
            shipIsShwon = true;
        }

        v3Set(pilotHelmet.rotation, cos(elapsedTime) * .1, sin(elapsedTime) * .3, cos(elapsedTime) * .01)
        v3Set(pilotHelmet.position, 0, sin(elapsedTime) * .05, 15)

        v3Set(pilotBody.rotation, cos(elapsedTime) * .1, sin(elapsedTime) * .2, cos(elapsedTime) * .01)
        v3Set(pilotBody.position, 0, sin(elapsedTime) * .05, 15)

        ship.position = v3(0, cos(4 * elapsedTime) * 0.2 + 1, 15);
        ship.rotation = v3(cos(elapsedTime) * 0.2 + .5, sin(elapsedTime) + PI / 2, cos(elapsedTime) * 0.01 - PI / 6);



        if (elapsedTime > 3) {
            beginPath();
            moveTo(0, 340);
            lineTo(width, 340);
            stroke();
        }
    }

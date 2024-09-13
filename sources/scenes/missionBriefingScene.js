missionBriefingScene = () => ({
    initialise: initialiseMissionBriefingScene,
    update: updateMissionBriefingScene
}),
    ship,
    shipIsAlive,
    lastFired,
    missileCount,
    canShoot,
    pilotHelmet,
    pilotBody

initialiseMissionBriefingScene = () => {
    drawBackgroundStars()
    elapsedTime = 0;

    meshes = [];
    pilotHelmet = loadMesh(pilotHelmetGeometry, v3(0, 0, 15))
    pilotBody = loadMesh(pilotBodyGeometry, v3(0, 0, 15))
    meshes.push(pilotHelmet, pilotBody);
    camera.position = v3();

    initiliseTerminalText([
        { text: ["Commander, we have an urgent", "mission for you. This is not", "a drill. I repeat:", "This is not a drill!"], duration: 10 },
        { text: ["On the far side of the moon", "there is a fearful area:", "AREA 13."], duration: 10 },
        { text: ["Currently there are some", "major issues on AREA 13.", "We need you to clear", "this area of intruders."], duration: 10 },
        { text: ["On your way to the moon", "you will encounter a very", "strange spaceship.", "Just destroy it!"], duration: 10 },

    ], spaceScene());
    terminalTextLinesTop = 340;

},

    updateMissionBriefingScene = () => {
        context.drawImage(starsCanvas, 0, 0);

        context.clearRect(0, 340, 480, 140);

        beginPath();
        moveTo(0, 340);
        lineTo(width, 340);
        stroke();

        v3Set(pilotHelmet.rotation, cos(elapsedTime) * .1, sin(elapsedTime) * .3, cos(elapsedTime) * .01)
        v3Set(pilotHelmet.position, 0, sin(elapsedTime) * .05, 15)

        v3Set(pilotBody.rotation, cos(elapsedTime) * .1, sin(elapsedTime) * .2, cos(elapsedTime) * .01)
        v3Set(pilotBody.position, 0, sin(elapsedTime) * .05, 15)
    }
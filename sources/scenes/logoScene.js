var
    logoScene = () => ({
        initialise: initialiseLogoScene,
        update: updateLogoScene
    }),
    nacaLogo,
    audio,

initialiseLogoScene = () => {
    gameIsOver = false;
    elapsedTime = 0;
    meshes = [];
    nacaLogo = loadMesh(nacaLogoGeometry, v3(0, 1, 20), v3(0, PI, 0), v3(1, 1, 1), true, false);
    meshes.push(nacaLogo);

    initiliseTerminalText([
        { text: ["             WARNING!", "Unauthorized access to this", "terminal is strictly prohibited!"], duration: 10 },
        { text: ["If you have TOP SECRET clearance", "press enter or click the", "screen to authenticate."], duration: 200 }
    ], passwordScene());
    terminalTextLinesTop = 380;



},

    updateLogoScene = () => {
        nacaLogo.rotation.y = PI - easeInOutQuad((elapsedTime % 5) / 5) * 2 * PI;
        if (upKeyPressed) camera.position.z += 1;

        font('bold 24px "Courier New"');
        fillText(white, "©1958", 205, 24);

    };

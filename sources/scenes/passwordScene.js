var
    passwordScene = () => ({
        initialise: initialisePasswordScene,
        update: updatePasswordScene
    }),
    posiblePasswords = "camera,lesson,suffer,search,amount,school,likely,museum,police,acting,silent,finish,review,active,mental,narrow,option,itself,effort,repeat,equity,summit,saving,surely,editor,relate,strict,entity,remote,partly,backed,column,member,august,common,medium,behind,visual,chosen,female,regime,german,formal,robust,behalf,stable,spoken,tissue,reason,strong".split(","),
    digits,
    currentPassword,
    passwordIsFound,
    alldigitsShown,
    atemptsLeft,
    notificationWindow,

    initialisePasswordScene = () => {
        meshes = [];
        playFX(terminalSound);
        notificationWindow = null;
        passwordIsFound = false;
        atemptsLeft = 3;
        digits = [""];
        alldigitsShown = false;
        let uniquePasswords = new Set();
        while (uniquePasswords.size < 20) uniquePasswords.add(posiblePasswords[round(random() * 49)].toUpperCase());


        passwords = Array.from(uniquePasswords).map((password, i) => ({
            text: password,
            x: round(random() * 27) * 14.5,
            y: 24 * i,
            w: 87,
            h: 24,
            clicked: false
        }));
        //set the password value
        currentPassword = passwords[floor(random() * 20)].text;
        passwordIsFound = false;
    },

    updatePasswordScene = () => {
        if (!alldigitsShown)
            if (digits[digits.length - 1].length < 33)
                for (let i = 0; i < 11; i++)
                    digits[digits.length - 1] += random() > 0.99 ? "█" : (random() > 0.90 ? " " : (round(random()) ? 1 : 0))
            else if (digits.length < 20)
                digits.push("");
            else
                alldigitsShown = true;

        font('bold 24px "Courier New"');

        for (let row = 0; row < digits.length; row++) {
            for (let column = 0; column < digits[row].length; column++) {
                if (random() > 0.98)
                    digits[row] = digits[row].substr(0, column) + (random() > 0.99 ? "█" : (random() > 0.90 ? " " : (round(random()) ? 1 : 0))) + digits[row].substr(column + 1);
            }
        }

        digits.forEach((text, i) => fillText(white, text, 0, i * 24 + 24));
        if (alldigitsShown)
            passwords.forEach(password => {
                clearRect(password.x, password.y + 5, password.w, password.h);
                if (mouseX > password.x && mouseX < password.x + password.w && mouseY > password.y && mouseY < password.y + password.h && !password.clicked) {
                    fillRect(white, password.x, password.y + 5, password.w, password.h);
                    fillText(black, password.text, password.x, password.y + 24);
                    if (mouseIsDown) {
                        password.clicked = true;
                        if (currentPassword === password.text) {
                            passwordIsFound = true;
                            playFX(terminalSound);
                            notificationWindow = createNotificationWindow("ACCESS GRANTED", 235, 200, 270, 40)
                        } else {
                            atemptsLeft--;
                            playFX(terminalNoSound);

        
                            if (atemptsLeft === 0) { gameIsOver = true; notificationWindow = createNotificationWindow("ACCESS DENIED", 235, 200, 250, 40) }
                            else {
                                notificationWindow = createNotificationWindow("ATEMPTS LEFT " + atemptsLeft, 235, 200, 270, 40);
                            }
                        }
                    }
                }
                else {
                    if (password.clicked) {
                        for (let i = 0; i < 6; i++) {
                            let currentChar = password.text[i];
                            fillText(currentPassword.includes(currentChar) ? white : gray, currentChar, password.x + i * 14.5, password.y + 24);
                        }
                    }
                    else {
                        fillText(white, password.text, password.x, password.y + 24);
                    }
                }
            });

        if (notificationWindow !== null) {
            updateNotificationWindow(notificationWindow)
            if (gameIsOver && notificationWindow.state === notificationStates.closed) showScene(logoScene());
            if (passwordIsFound && notificationWindow.state === notificationStates.closed) showScene(introScene());
        }
    };

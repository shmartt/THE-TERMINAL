const notificationStates = { "opening": 0, "opened": 1, "closing": 2, "closed": 3 },
    ASCIICharacters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

var createNotificationWindow = (text, x, y, width, height) => ({
    text,
    x,
    y,
    width,
    height,
    state: notificationStates.opening,
    currentWidth: 0,
    currentHeight: 0,
    characters: text.split(''),
    characterIndex: 0,
    currentText: "",
    timeElapsed: 0,
    timeElapsedTextUpdate: 0
});

updateNotificationWindow = (w) => {
    w.timeElapsed += deltaTime;
    if (w.timeElapsed > 5) w.state = notificationStates.closing;

    if (w.state !== notificationStates.closed)
        fillRect(black, w.x - w.currentWidth * 0.5, w.y - w.currentHeight * 0.5, w.currentWidth + w.currentHeight * 0.5, w.currentHeight + 5);

    if (w.state === notificationStates.opening) {
        if (w.currentWidth <= w.width) w.currentWidth += (w.width - w.currentWidth) * deltaTime * 10;
        if (w.currentHeight <= w.height) w.currentHeight += (w.height - w.currentHeight) * deltaTime * 10;
        if (w.currentWidth >= w.width - .2) w.state = notificationStates.opened;
    }

    if (w.state === notificationStates.closing) {
        if (w.currentWidth > 0) w.currentWidth -= (w.width - w.currentWidth) * deltaTime * 30;
        if (w.currentHeight > 0) w.currentHeight -= (w.height - w.currentHeight) * deltaTime * 30;
        if (w.currentHeight <= .2) w.state = notificationStates.closed;
    }

    if (w.state === notificationStates.opened) {
        w.timeElapsedTextUpdate += deltaTime;
        if (w.timeElapsedTextUpdate >= 0.05) {
            w.timeElapsedTextUpdate = 0; // Reset timer

            w.currentText = "";
            let i = 0;
            while (i < w.characters.length) {
                if (i >= w.characterIndex) {
                    if (w.characters[i] !== " ")
                        w.characters[i] = ASCIICharacters[round(random() * 35)];
                    if (random() > 0.8) {
                        w.characters[i] = w.text.charAt(i);
                        w.characterIndex++;
                    }
                }
                else w.characters[i] = w.text.charAt(i);
                w.currentText += w.characters[i];
                i++;
            }
        }

        font('bold 32px "Courier New"');
        fillText(white, w.currentText, w.x - w.width * 0.5 + 12, w.y + 12);

        if (mouseIsDown)
            w.state = notificationStates.closing;
    }
}


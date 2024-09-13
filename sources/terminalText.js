var
    terminalQueue,
    terminalQueueIndex,
    terminalTextLinesNextScene,

    terminalTextLines = [],
    terminalTextLineIndex,
    terminalTextLinesShown,

    terminalTextLinesTop,
    terminalCharacterHeight,

    terminalElapsedTime,

    initiliseTerminalText = (textLinesQueue, nextScene = null) => {
        terminalTextLinesNextScene = nextScene;
        terminalQueue = textLinesQueue;
        terminalQueueIndex = 0;
        terminalTextLines = [];
        terminalTextLineIndex = 0;
        terminalTextLinesShown = false;
        terminalTextLinesTop = 24;
        terminalCharacterHeight = 24;
        terminalElapsedTime = 0;
        addTerminalTextLines(terminalQueue[0].text);
    },

    updateTerminalText = () => {
        if (terminalTextLines.length === 0) return;

        terminalElapsedTime += deltaTime;

        if (terminalQueueIndex < terminalQueue.length) {
            if (terminalTextLinesShown && (terminalElapsedTime > terminalQueue[terminalQueueIndex].duration || mouseIsDown || enterKeyPressed)) {
                playFX(clickSound);
                terminalQueueIndex++;
                terminalElapsedTime = 0;
                if (terminalQueueIndex < terminalQueue.length) {
                    addTerminalTextLines(terminalQueue[terminalQueueIndex].text);
                } else {
                    terminalQueue = {};
                    terminalTextLines = [];
                    if (terminalTextLinesNextScene !== null) showScene(terminalTextLinesNextScene);
                    return;
                }
            }
        }

        const textLine = terminalTextLines[terminalTextLineIndex];

        textLine.elapsedTime = (textLine.elapsedTime + deltaTime) % 1;
        textLine.showCaret = textLine.elapsedTime < 0.5;

        if (random() > 0.8 && textLine.currentCharacterIndex < textLine.text.length)
            textLine.currentCharacterIndex += round(random() * 2) + 1;

        if (textLine.currentCharacterIndex >= textLine.text.length && terminalTextLineIndex < terminalTextLines.length - 1)
            terminalTextLineIndex++;

        font('bold 24px "Courier New"');

        terminalTextLines.forEach((line, i) => {
            fillText(
                white,
                line.text.substr(0, line.currentCharacterIndex) + (line.showCaret && i === terminalTextLineIndex ? '█' : ''),
                0,
                terminalCharacterHeight * i + terminalCharacterHeight + terminalTextLinesTop
            );
        });

        if (terminalTextLineIndex === terminalTextLines.length - 1 && !terminalTextLinesShown && textLine.currentCharacterIndex >= textLine.text.length) {
            terminalTextLinesShown = true;
        }
    },

    addTerminalTextLines = (textLines) => {
        terminalTextLineIndex = 0;
        terminalTextLinesShown = false;
        terminalTextLines = [];
        textLines.forEach(text => {
            terminalTextLines.push({
                text,
                currentCharacterIndex: 0,
                showCaret: false,
                elapsedTime: 0
            });
        })
    };
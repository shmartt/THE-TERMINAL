var
    tweens = [],
    addTween = (target, position, rotation = v3(), duration = 3, delay = 0, loop = false) => {
        tweens.push({
            target: target,
            toPosition: position,
            toRotation: rotation,
            duration,
            delay: delay,
            elapsedTime: 0,
            fromPosition: v3Clone(target.position),
            fromRotation: v3Clone(target.rotation),
            loop
        });
    },


    updateTweens = () => {
        let i = 0,
            tweensLength = tweens.length,
            currentTime,
            tween,
            target;


        while (i < tweensLength) {
            tween = tweens[i];
            tween.delay -= deltaTime;
            if (tween.delay > 0) { i++; continue; }

            tween.elapsedTime += deltaTime;
            currentTime = tween.elapsedTime / tween.duration;
            target = tween.target;

            target.position = v3Lerp(tween.fromPosition, tween.toPosition, easeInOutQuad(currentTime));
            target.rotation = v3Lerp(tween.fromRotation, tween.toRotation, easeInOutQuad(currentTime));

            if (tween.elapsedTime > tween.duration) {
                if (tween.loop) {
                    tween.currentTime = 0;
                    tween.delay = 0;
                } else {
                    tweens.splice(i, 1);
                    tweensLength = tweens.length;
                }
            } else i++;
        }
    }
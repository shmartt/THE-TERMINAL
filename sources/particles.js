const particles = [],

    addParticle = (position, direction, planeWidth, planeHeight, life = 1, color = white, canColide = false) => {
        let particle = plane(planeWidth, planeHeight, position, color, v3(), false, canColide);
        particle.direction = direction;
        particle.isEnemyBullet = false;
        particle.life = random() * (life / 2) + life / 2;
        particles.push(particle);
        meshes.push(particle);
    },

    updateParticles = () => {
        let i = 0, particlesLength = particles.length, particle = null;
        while (i < particlesLength) {
            particle = particles[i];
            particle.life -= deltaTime;
            if (particle.life < 0) {
                particles.splice(i, 1);
                meshes.splice(meshes.indexOf(particle), 1);
                particlesLength--;
            } else {
                particle.position = v3Add(particle.position, v3Multiply(particle.direction, deltaTime));
                i++
            }
        }
    },

    addExplosion = (position, power = 10) => {
        for (let index = 0; index < 30; index++) {
            addParticle(
                v3Clone(position),
                v3(
                    random() * power - power / 2,
                    random() * power,
                    random() * power - power / 2
                ),
                .01,
                4,
                1)
        }
    },

    shootMissles = (position, direction) => {
        addParticle(v3Add(position, v3(-1, 0, 0)), v3RotateZ(v3(0, 0, 500), direction.z), .1, 20, 1, white, true);
        addParticle(v3Add(position, v3(1, 0, 0)), v3RotateZ(v3(0, 0, 500), direction.z), .1, 20, 1, white, true);
    },

    shootProjectile = (position, target) => {
        let particle = cube(position, .5, .5, 1);
        particle.direction = v3Multiply(v3Sub(target, position), .1);
        particle.canColide = true;
        particle.isEnemyBullet = true;
        particle.life = 2;
        particles.push(particle);
        meshes.push(particle);
    }
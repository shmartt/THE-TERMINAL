var v3 = (x = 0.0, y = 0.0, z = 0.0) => ({ x, y, z }),
    v3Set = (v, x, y, z) => { v.x = x; v.y = y; v.z = z },
    v3Clone = (v) => v3(v.x, v.y, v.z),
    v3Add = (a, b) => v3(a.x + b.x, a.y + b.y, a.z + b.z),
    v3Sub = (a, b) => v3(a.x - b.x, a.y - b.y, a.z - b.z),
    v3Scale = (a, b) => v3(a.x * b.x, a.y * b.y, a.z * b.z),
    v3Multiply = (v, f) => v3(v.x * f, v.y * f, v.z * f),
    v3Divide = (v, f) => v3(v.x / f, v.y / f, v.z / f),
    v3Length = (v) => Math.hypot(v.x, v.y, v.z),
    v3Cross = (a, b) => v3(a.y * b.z - a.z * b.y, a.z * b.x - a.x * b.z, a.x * b.y - a.y * b.x),
    v3Dot = (a, b) => (a.x * b.x + a.y * b.y + a.z * b.z),
    v3Normalise = (v) => v3Divide(v, v3Length(v)),
    v3RotateX = (v, a) => v3(v.x, v.y * cos(a) - v.z * sin(a), v.y * sin(a) + v.z * cos(a)),
    v3RotateY = (v, a) => v3(v.x * cos(a) - v.z * sin(a), v.y, v.x * sin(a) + v.z * cos(a)),
    v3RotateZ = (v, a) => v3(v.x * cos(a) - v.y * sin(a), v.x * sin(a) + v.y * cos(a), v.z),
    v3Lerp = (a, b, t) => v3Add(a, v3Multiply(v3Sub(b, a), t)),
    v3Distance = (a, b) => v3Length(v3Sub(a, b)),
    v3Angle = (a, b) => Math.atan2(b.x - a.x, b.z - a.z),
    lerp = (a, b, t) => a + t * (b - a),
    frustumPlanes = [
        { point: v3(0, 0, 0), normal: v3(cos(.525), 0, sin(.525)) },
        { point: v3(0, 0, 0), normal: v3(-cos(.525), 0, sin(.525)) },
        { point: v3(0, 0, 0), normal: v3(0, -cos(Math.atan(Math.tan(.525) * (innerWidth / innerHeight))), sin(Math.atan(Math.tan(.525) * (innerWidth / innerHeight)))) },
        { point: v3(0, 0, 0), normal: v3(0, cos(Math.atan(Math.tan(.525) * (innerWidth / innerHeight))), sin(Math.atan(Math.tan(.525) * (innerWidth / innerHeight)))) },
        { point: v3(0, 0, 1), normal: v3(0, 0, 1) },
        { point: v3(0, 0, 300), normal: v3(0, 0, -1) }],
    clipFace = (vertices, point, normal) => {
        let previousVertex = vertices[vertices.length - 1],
            previousDot = v3Dot(v3Sub(previousVertex, point), normal),
            index = 0, verticesLength = vertices.length;
        while (index < verticesLength) {
            let currentVertex = vertices[index];
            let currentDot = v3Dot(v3Sub(currentVertex, point), normal);
            if (currentDot * previousDot < 0) {
                vertices.splice(index, 0, v3Lerp(previousVertex, currentVertex, previousDot / (previousDot - currentDot)));
                index++;
                verticesLength++;
            }
            if (currentDot <= 0) {
                vertices.splice(index, 1);
                verticesLength--; index--;
            }
            previousDot = currentDot;
            previousVertex = currentVertex;
            index++;
        }
    },
    meshes = [],
    camera = { position: v3(0, 0, 0), rotation: v3(0, 0, 0), distance: 842 },
    render = () => {
        const facesToDraw = [];
        meshes.forEach(mesh => {
            // transform all vertices with mesh position, rotation and scale  and the camera position and rotation
            transformedVertices = mesh.vertices.map(vertex =>
                v3RotateZ(
                    v3RotateY(
                        v3RotateX(
                            v3Sub(
                                v3Add(
                                    v3RotateZ(
                                        v3RotateY(
                                            v3RotateX(
                                                v3Scale(vertex, mesh.scale),
                                                mesh.rotation.x),
                                            mesh.rotation.y),
                                        mesh.rotation.z),
                                    mesh.position),
                                camera.position),
                            -camera.rotation.x),
                        -camera.rotation.y),
                    -camera.rotation.z));

            mesh.faces.forEach(face => {
                const vertices = face.map(vertexIndex => transformedVertices[vertexIndex]);
                const faceNormal = v3Cross(v3Normalise(v3Sub(vertices[1], vertices[0])), v3Normalise(v3Sub(vertices[2], vertices[0])));
                let color = mesh.color;
                if (mesh.backfaceCulling) if (v3Dot(faceNormal, vertices[0]) > 0) color = darkGray; // back-face culling
                frustumPlanes.forEach((plane) => { if (vertices.length < 3) return; clipFace(vertices, plane.point, plane.normal); });
                if (vertices.length < 3) return; // if we don't have at lest 3 points after cliping we move to the next face
                facesToDraw.push({ vertices, color, maxZ: Math.max(...vertices.map(v => v.z)), closePath: mesh.closePath });
            });
        });

        // sort all faces based on max z value
        facesToDraw.sort((a, b) => b.maxZ - a.maxZ);
        // draw all faces
        context.lineCap = "round";
        facesToDraw.forEach(({ vertices, color, closePath }) => {
            context.strokeStyle = color;
            context.beginPath();
            vertices.forEach(({ x, y, z }) => {
                context.lineTo(
                    Math.round((x * camera.distance / z) + halfWidth),
                    Math.round((-y * camera.distance / z) + halfHeight));
            });
            if (closePath) context.closePath();
            context.stroke();
        });
    }

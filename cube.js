export class Cube {
    constructor(gl, size, color, cubePosition) {
        this.gl = gl;

        this.positions = ([
            // Front face
            -1.0, -1.0, 1.0,
            1.0, -1.0, 1.0,
            1.0, 1.0, 1.0,
            -1.0, 1.0, 1.0,

            // Back face
            -1.0, -1.0, -1.0,
            -1.0, 1.0, -1.0,
            1.0, 1.0, -1.0,
            1.0, -1.0, -1.0,

            // Top face
            -1.0, 1.0, -1.0,
            -1.0, 1.0, 1.0,
            1.0, 1.0, 1.0,
            1.0, 1.0, -1.0,

            // Bottom face
            -1.0, -1.0, -1.0,
            1.0, -1.0, -1.0,
            1.0, -1.0, 1.0,
            -1.0, -1.0, 1.0,

            // Right face
            1.0, -1.0, -1.0,
            1.0, 1.0, -1.0,
            1.0, 1.0, 1.0,
            1.0, -1.0, 1.0,

            // Left face
            -1.0, -1.0, -1.0,
            -1.0, -1.0, 1.0,
            -1.0, 1.0, 1.0,
            -1.0, 1.0, -1.0,
        ]).map((point) => point * size);
        this.position = cubePosition;
        this.positionBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.positions), this.gl.STATIC_DRAW);

        this.faceColors = new Array(6).fill(color);
        this.colors = this.faceColors.flatMap(color => [...color, ...color, ...color, ...color]);
        this.colorBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.colorBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.colors), this.gl.STATIC_DRAW);

        this.triangles = [
            0, 1, 2, 0, 2, 3,    // front
            4, 5, 6, 4, 6, 7,    // back
            8, 9, 10, 8, 10, 11,   // top
            12, 13, 14, 12, 14, 15,   // bottom
            16, 17, 18, 16, 18, 19,   // right
            20, 21, 22, 20, 22, 23,   // left
        ];
        this.triangleBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.triangleBuffer);
        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.triangles), this.gl.STATIC_DRAW);

        this.normals = [
            [0, 0, 1],
            [0, 0, -1],
            [0, 1, 0],
            [0, -1, 0],
            [1, 0, 0],
            [-1, 0, 0],
        ];
        this.normals = this.normals.flatMap(n => [...n, ...n, ...n, ...n]);
        this.normalBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.normalBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.normals), this.gl.STATIC_DRAW);
    }

    getBuffers() {
        return {
            position: this.positionBuffer,
            color: this.colorBuffer,
            indices: this.triangleBuffer,
            normal: this.normalBuffer,

            raw_position: this.positions,
            raw_color: this.faceColors,
            raw_indices: this.triangles,
            raw_normals: this.normals,
        };
    }

    setVertexes(programInfo) {
        const gl = this.gl;
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        gl.vertexAttribPointer(programInfo.attribLocations.vertexPosition, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
        gl.vertexAttribPointer(programInfo.attribLocations.normal, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(programInfo.attribLocations.normal);

        gl.bindBuffer(this.gl.ARRAY_BUFFER, this.colorBuffer);
        gl.vertexAttribPointer(programInfo.attribLocations.vertexColor, 4, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(programInfo.attribLocations.vertexColor);
    }

    toPosition(modelViewMatrix) {
        this.translate(modelViewMatrix, this.position);
    }

    translate(modelViewMatrix, translation) {
        return mat4.translate(modelViewMatrix, modelViewMatrix, translation);
    }

    rotate(modelViewMatrix, rad, axis) {
        return mat4.rotate(modelViewMatrix, modelViewMatrix, rad, axis);
    }

    rotateAround(modelViewMatrix, rad, point) {
        const translation = this.position.map((p, i) => p - point[i]);
        this.translate(modelViewMatrix, translation.map(p => -p));
        this.rotate(modelViewMatrix, rad, [0, 1, 0]);
        this.translate(modelViewMatrix, translation);
    }
}

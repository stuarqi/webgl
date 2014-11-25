var VSHADER_SOURCE =
    'attribute vec4 a_Position;\n' +
    'uniform mat4 u_xformMatrix;\n' +
    'void main() {\n' +
    '   gl_Position = u_xformMatrix * a_Position;\n' +
    '}\n';

var FSHADER_SOURCE =
    'precision mediump float;\n' +
    'void main() {\n' +
    '   gl_FragColor = vec4(0.0, 0.0, 1.0, 1.0);\n' +
    '}\n';

function main() {
    var gl = getWebGLContext(document.querySelector('#webgl'));
    if (!gl) {
        console.log('Failed to get rendering context for WebGL');
        return;
    }
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log('Failed to initialize shaders');
        return;
    }
    var n = initVertexBuffer(gl);
    if (n < 0) {
        console.log('Failed to set positions of the vertex');
        return false;
    }

    var xformMatrix = new Float32Array([
        1.0, 0.0, 0.0, 0.0,
        0.0, 1.0, 0.0, 0.0,
        0.0, 0.0, 1.0, 0.0,
        0.5, 0.5, 0.0, 1.0
    ]);

    /* 平移矩阵

    |-                    -|
    |  1.0  0.0  0.0  0.0  |
    |  0.0  1.0  0.0  0.0  |
    |  0.0  0.0  1.0  0.0  |
    |  tx   ty   tz   1.0  |
    |-                    -|


     */

    var u_xformMatrix = gl.getUniformLocation(gl.program, 'u_xformMatrix');
    gl.uniformMatrix4fv(u_xformMatrix, false, xformMatrix);

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.drawArrays(gl.TRIANGLES, 0, n);
}

function initVertexBuffer(gl) {
    var vertices = new Float32Array([
        0.0, 0.5, -0.5, -0.5, 0.5, -0.5
    ]);
    var n = 3;

    var vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
        console.log('Failded to create buffer object');
        return -1;
    }
    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Position);

    return n;
}
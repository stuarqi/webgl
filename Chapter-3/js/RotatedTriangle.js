var VSHADER_SOURCE =
    'attribute vec4 a_Position;\n' +
    'uniform float u_CosB, u_SinB;\n' +
    'void main() {\n' +
    /*'   gl_Position = vec4(' +
    '       a_Position[0] * u_CosB - a_Position[1] * u_SinB,' +
    '       a_Position[0] * u_SinB + a_Position[1] * u_CosB,' +
    '       a_Position[2]' +
    '   );\n' +*/
    '   gl_Position.x = a_Position.x * u_CosB - a_Position.y * u_SinB;\n' +
    '   gl_Position.y = a_Position.x * u_SinB + a_Position.y * u_CosB;\n' +
    '   gl_Position.z = a_Position.z;\n' +
    '   gl_Position.w = 1.0;\n' +
    '}\n';

var FSHADER_SOURCE =
    'precision mediump float;\n' +
    'void main() {\n' +
    '   gl_FragColor = vec4(0.0, 1.0, 0.0, 1.0);\n' +
    '}\n';

var ANGLE = 90.0;

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
        return;
    }

    var u_CosB = gl.getUniformLocation(gl.program, 'u_CosB'),
        u_SinB = gl.getUniformLocation(gl.program, 'u_SinB'),
        radian = Math.PI * ANGLE / 180,
        cosB = Math.cos(radian),
        sinB = Math.sin(radian);

    gl.uniform1f(u_CosB, cosB);
    gl.uniform1f(u_SinB, sinB);

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
        console.log('Failed to create buffer object');
        return -1;
    }
    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Position);

    return n;
}
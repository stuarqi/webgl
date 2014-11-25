var VSHADER_SOURCE =
    'attribute vec4 a_Position;\n' +
    'void main() {\n' +
    '   gl_Position = a_Position;\n' +
    '   gl_PointSize = 10.0;\n' +
    '}\n';

var FSHADER_SOURCE =
    'precision mediump float;\n' +
    'uniform vec4 u_FragColor;\n' +
    'void main() {\n' +
    '   gl_FragColor = u_FragColor;\n' +
    '}\n';

function main() {
    var canvas = document.querySelector('#webgl'),
        gl = getWebGLContext(canvas);
    if (!gl) {
        console.log('Failed to get the rendering context for WebGL');
        return;
    }
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log('Failed to initialize shaders');
        return;
    }
    var a_Position = gl.getAttribLocation(gl.program, 'a_Position'),
        u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');

    canvas.addEventListener('click', function (evt) {
        click(evt, gl, canvas, a_Position, u_FragColor);
    }, false);

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
}

var g_points = [],
    g_colors = [];
function click(evt, gl, canvas, a_Position, u_FragColor) {
    var x = evt.clientX,
        y = evt.clientY,
        rect = evt.target.getBoundingClientRect(),
        color;

    x = ((x - rect.left) - canvas.width / 2) / (canvas.width / 2);
    y = (canvas.height / 2 - (y - rect.top)) / (canvas.height / 2);

    if (x >= 0 && y >= 0) {
        color = [1.0, 0.0, 0.0, 1.0];
    } else if (x < 0 && y < 0) {
        color = [0.0, 1.0, 0.0, 1.0];
    } else if (x < 0 && y >= 0) {
        color = [0.0, 0.0, 1.0, 1.0];
    } else {
        color = [1.0, 1.0, 0.0, 1.0];
    }

    g_points.push([x, y]);
    g_colors.push(color);

    var len = g_points.length,
        pt, c;

    gl.clear(gl.COLOR_BUFFER_BIT);
    for (var i = 0; i < len; i++) {
        pt = g_points[i];
        c = g_colors[i];
        gl.vertexAttrib3f(a_Position, pt[0], pt[1], pt[2]);
        gl.uniform4f(u_FragColor, c[0], c[1], c[2], c[3]);
        gl.drawArrays(gl.POINTS, 0, 1);
    }
}
//顶点着色器程序
var VSHADER_SOURCE =
    'attribute vec4 a_Position;\n' +
    'attribute vec2 a_TexCoord;\n' +
    'varying vec2 v_TexCoord;\n' +
    'void main() {\n' +
    '   gl_Position = a_Position;\n' +
    '   v_TexCoord = a_TexCoord;\n' +
    '}\n';

//片元着色器程序
var FSHADER_SOURCE =
    'precision mediump float;\n' +
    'uniform sampler2D u_Sampler;\n' +
    'varying vec2 v_TexCoord;\n' +
    'void main() {\n' +
    '   gl_FragColor = texture2D(u_Sampler, v_TexCoord);\n' +
    '}\n';

function main() {
    var gl = getWebGLContext(document.querySelector('#webgl'));
    initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE);
    var n = initVertexBuffers(gl);

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    //gl.clear(gl.COLOR_BUFFER_BIT);

    initTextures(gl, n);
}

function initVertexBuffers(gl) {
    var verticesTexCoords = new Float32Array([
        -0.5, 0.5, 0.0, 1.0,
        -0.5, -0.5, 0.0, 0.0,
        0.5, 0.5, 1.0, 1.0,
        0.5, -0.5, 1.0, 0.0
    ]);
    /*var verticesTexCoords = new Float32Array([
        -0.5, 0.5, -0.3, 1.7,
        -0.5, -0.5, -0.3, -0.2,
        0.5, 0.5, 1.7, 1.7,
        0.5, -0.5, 1.7, -0.2
    ]);*/
    var n = 4;

    var vertexTexCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexTexCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, verticesTexCoords, gl.STATIC_DRAW);

    var FSIZE = verticesTexCoords.BYTES_PER_ELEMENT;

    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 4, 0);
    gl.enableVertexAttribArray(a_Position);

    var a_TexCoord = gl.getAttribLocation(gl.program, 'a_TexCoord');
    gl.vertexAttribPointer(a_TexCoord, 2, gl.FLOAT, false, FSIZE * 4, FSIZE * 2);
    gl.enableVertexAttribArray(a_TexCoord);

    return n;
}

function initTextures(gl, n) {
    //创建纹理对象
    var texture = gl.createTexture();

    //获取u_Sampler的存储位置
    var u_Sampler = gl.getUniformLocation(gl.program, 'u_Sampler');

    //创建一个image对象
    var image = new Image();

    //注册图像加载事件的响应函数
    image.onload = function () {
        loadTexture(gl, n, texture, u_Sampler, image);
    };

    image.src = 'image/sky.png';

    return true;
}

function loadTexture(gl, n, texture, u_Sampler, image) {
    //对纹理图像进行Y轴翻转
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
    //开启0号纹理单元
    gl.activeTexture(gl.TEXTURE0);
    //console.log(gl.TEXTURE0, texture);
    //向target绑定纹理对象
    gl.bindTexture(gl.TEXTURE_2D, texture);
    //配置纹理参数
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.MIRRORED_REPEAT);
    //配置纹理图像
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
    //将0号纹理传递给着色器
    gl.uniform1i(u_Sampler, 0);

    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);
}
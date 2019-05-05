main();
cubeRotationRadians = 0;

function loadShader(gl, glShaderType, srcStr)
{
    const shader = gl.createShader(glShaderType);
    gl.shaderSource(shader, srcStr);
    gl.compileShader(shader)
    if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
    {
        alert("FAILED TO COMPILE SHADER:" + gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }
    return shader;
}

function initShaderProgram(gl, vertSrc, fragSrc)
{
    const vertShader = loadShader(gl, gl.VERTEX_SHADER, vertSrc);
    const fragShader = loadShader(gl, gl.FRAGMENT_SHADER, fragSrc);
    if(!vertShader || !fragShader) { return null;} //will be alerted in shader functions

    const shaderProg = gl.createProgram();
    gl.attachShader(shaderProg, vertShader);
    gl.attachShader(shaderProg, fragShader);
    gl.linkProgram(shaderProg);
    if(!gl.getProgramParameter(shaderProg, gl.LINK_STATUS))
    {
        alert("Failed to link shader program" + gl.getProgramInfoLog(shaderProg));
        gl.deleteProgram(shaderProg);
        return null;
    }
    return shaderProg;
}

function initBuffers(gl)
{
    const positionVBO = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionVBO);
    const positions = [
        // Front face
        -1.0, -1.0,  1.0,
         1.0, -1.0,  1.0,
         1.0,  1.0,  1.0,
        -1.0,  1.0,  1.0,
        
        // Back face
        -1.0, -1.0, -1.0,
        -1.0,  1.0, -1.0,
         1.0,  1.0, -1.0,
         1.0, -1.0, -1.0,
        
        // Top face
        -1.0,  1.0, -1.0,
        -1.0,  1.0,  1.0,
         1.0,  1.0,  1.0,
         1.0,  1.0, -1.0,
        
        // Bottom face
        -1.0, -1.0, -1.0,
         1.0, -1.0, -1.0,
         1.0, -1.0,  1.0,
        -1.0, -1.0,  1.0,
        
        // Right face
         1.0, -1.0, -1.0,
         1.0,  1.0, -1.0,
         1.0,  1.0,  1.0,
         1.0, -1.0,  1.0,
        
        // Left face
        -1.0, -1.0, -1.0,
        -1.0, -1.0,  1.0,
        -1.0,  1.0,  1.0,
        -1.0,  1.0, -1.0,
      ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    const faceColors = [
        [1.0,  1.0,  1.0,  1.0],    // Front face: white
        [1.0,  0.0,  0.0,  1.0],    // Back face: red
        [0.0,  1.0,  0.0,  1.0],    // Top face: green
        [0.0,  0.0,  1.0,  1.0],    // Bottom face: blue
        [1.0,  1.0,  0.0,  1.0],    // Right face: yellow
        [1.0,  0.0,  1.0,  1.0],    // Left face: purple
      ];
    var colors = [];
    for(var face = 0; face < faceColors.length; ++face)
    {
        const faceColor = faceColors[face];
        //add this face color 4 times to the existing array
        colors = colors.concat(faceColor, faceColor, faceColor, faceColor)
    }

    const vertColorVBO = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertColorVBO);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);


    
    const indices = [
        0,  1,  2,      0,  2,  3,    // front
        4,  5,  6,      4,  6,  7,    // back
        8,  9,  10,     8,  10, 11,   // top
        12, 13, 14,     12, 14, 15,   // bottom
        16, 17, 18,     16, 18, 19,   // right
        20, 21, 22,     20, 22, 23,   // left
    ];
    const indexBufferEAO = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBufferEAO);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

    return {
        posVBO : positionVBO,
        colorVBO : vertColorVBO,
        cubeEAO : indexBufferEAO,
    };
}

function drawScene(gl, shaderStruct, buffers, deltatime)
{
    gl.clearColor(0.0,0.0,0.0,1.0);
    gl.clearDepth(1.0);
    gl.enable(gl.DEPTH_TEST); 
    gl.depthFunc(gl.LEQUAL); //some of these may be default?, they are in opengl3.3
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    const FOV = 45 * (Math.PI/180);
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    const zNear = 0.1;
    const zFar = 100;
    const projectionMatrix = mat4.create();
    mat4.perspective(projectionMatrix, FOV, aspect, zNear, zFar);

    //move square to infer this libraries matrix concatenation ordering
    cubeRotationRadians += deltatime;
    const view_model = mat4.create();
    mat4.translate(/*outvar*/view_model, /*mat to translate*/ view_model, [0.0, 0.0, -6.0]);
    mat4.rotate(view_model, view_model, cubeRotationRadians, [0, 0, 1]); //appears to be [old_mat4]*[new_mat4] ordering 
    mat4.rotate(view_model, view_model, cubeRotationRadians, [0, 1, 0]); 
    { //scope the parameter names
        const numAttribVecComponents = 3;
        const glDataType = gl.FLOAT;
        const normalizeData = false;
        const stride = 0; //how is this set in webgl? c it is like 2*sizeof(float) etc
        const offset = 0;
        gl.bindBuffer(gl.ARRAY_BUFFER, buffers.posVBO);
        gl.vertexAttribPointer(
            shaderStruct.attribLocations.pos,
            numAttribVecComponents, glDataType, normalizeData, stride, offset
        );
        gl.enableVertexAttribArray(shaderStruct.attribLocations.pos);
    }
    //see above vertex attribute to understand what parameters are
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.colorVBO);
    gl.vertexAttribPointer(shaderStruct.attribLocations.color, 4, gl.FLOAT, false, 0, 0)
    gl.enableVertexAttribArray(shaderStruct.attribLocations.color);

    gl.useProgram(shaderStruct.program)
    gl.uniformMatrix4fv(shaderStruct.uniformLocations.projection, false, projectionMatrix);
    gl.uniformMatrix4fv(shaderStruct.uniformLocations.view_model, false, view_model);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.cubeEAO);
    {
        const vertexCount = 36;
        const type = gl.UNSIGNED_SHORT;
        const offset = 0;
        gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
    }
}

function main()
{
    const canvas = document.querySelector("#glCanvas");
    const gl = canvas.getContext("webgl");

    if(!gl)
    {
        alert("Failed to get webgl context; browser may not support webgl 1.0");
        return;
    }

    const vertSrc =
    `
        attribute vec4 vertPos;
        attribute vec4 color;

        uniform mat4 view_model;
        uniform mat4 projection;

        varying lowp vec4 vColor; //this is like an out variable in opengl3.3+

        void main(){
            gl_Position = projection * view_model * vertPos;
            vColor = color;
        }
    `;
    const fragSrc = `
        varying lowp vec4 vColor;
        void main(){
            //draw shape as white
            gl_FragColor = vColor;
        }
    `;
    const shader = initShaderProgram(gl, vertSrc, fragSrc);
    const shaderStruct = {
        program : shader,
        attribLocations : {
            pos: gl.getAttribLocation(shader, "vertPos"),
            color: gl.getAttribLocation(shader, "color"),
        },
        uniformLocations : {
            projection : gl.getUniformLocation(shader, "projection"),
            view_model : gl.getUniformLocation(shader, "view_model"),
        },
    };

    const buffers = initBuffers(gl);

    var prevSec = 0
    function renderLoopCallback(nowMS)
    {
        nowSec = nowMS * 0.001;
        const deltatime = nowSec - prevSec;
        drawScene(gl, shaderStruct, buffers, deltatime); //seems wasteful to keep re-configuring vertext attrib, but this is a tutorial
        prevSec = nowSec;

        requestAnimationFrame(renderLoopCallback);
    }
    requestAnimationFrame(renderLoopCallback);
}
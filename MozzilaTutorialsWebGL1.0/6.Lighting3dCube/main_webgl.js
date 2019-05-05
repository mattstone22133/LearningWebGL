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
function isPowerOf2(value)
{
    //powers of 2 should only occupy a single bit; use bitwise operators to ensure this is true
    return (value & (value - 1)) == 0
}

function loadTexture(gl, url)
{
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    
    //display error color until the image is loaded
    const level = 0;
    const internalFormat = gl.RGBA;
    const width = 1;
    const height = 1;
    const border = 0;
    const srcFormat = gl.RGBA;
    const srcType = gl.UNSIGNED_BYTE;
    const pixel = new Uint8Array([255, 0, 255, 255]); //basicaly [1,0,1,1] color becuase it is really obvious 
    gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, width,  height, border, srcFormat, srcType, pixel);

    const image = new Image();
    image.onload = function(){ //javascript lambdas? :D 
        //image is now loaded once this callback is hit
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, srcFormat, srcType, image);
        
        if(isPowerOf2(image.width) && isPowerOf2(image.height))
        {
            //leave default texturing filtering? tutorial doesn't specify anything
            gl.generateMipmap(gl.TEXTURE_2D);
        } else 
        {
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        }
    }
    image.src = url; //does this invoke the load? :O seems like load is only invoked when used?
    return texture;
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



    //texture coordinates
    const textureCoordinates = [
        // Front
        0.0,  0.0,
        1.0,  0.0,
        1.0,  1.0,
        0.0,  1.0,
        // Back
        0.0,  0.0,
        1.0,  0.0,
        1.0,  1.0,
        0.0,  1.0,
        // Top
        0.0,  0.0,
        1.0,  0.0,
        1.0,  1.0,
        0.0,  1.0,
        // Bottom
        0.0,  0.0,
        1.0,  0.0,
        1.0,  1.0,
        0.0,  1.0,
        // Right
        0.0,  0.0,
        1.0,  0.0,
        1.0,  1.0,
        0.0,  1.0,
        // Left
        0.0,  0.0,
        1.0,  0.0,
        1.0,  1.0,
        0.0,  1.0,
    ];
    const UVBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, UVBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordinates), gl.STATIC_DRAW);


    const vertexNormals = [
        // Front
         0.0,  0.0,  1.0,
         0.0,  0.0,  1.0,
         0.0,  0.0,  1.0,
         0.0,  0.0,  1.0,
    
        // Back
         0.0,  0.0, -1.0,
         0.0,  0.0, -1.0,
         0.0,  0.0, -1.0,
         0.0,  0.0, -1.0,
    
        // Top
         0.0,  1.0,  0.0,
         0.0,  1.0,  0.0,
         0.0,  1.0,  0.0,
         0.0,  1.0,  0.0,
    
        // Bottom
         0.0, -1.0,  0.0,
         0.0, -1.0,  0.0,
         0.0, -1.0,  0.0,
         0.0, -1.0,  0.0,
    
        // Right
         1.0,  0.0,  0.0,
         1.0,  0.0,  0.0,
         1.0,  0.0,  0.0,
         1.0,  0.0,  0.0,
    
        // Left
        -1.0,  0.0,  0.0,
        -1.0,  0.0,  0.0,
        -1.0,  0.0,  0.0,
        -1.0,  0.0,  0.0
    ];

    const normalsBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, normalsBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexNormals), gl.STATIC_DRAW);
    
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
        uvVBO : UVBuffer,
        normalVBO : normalsBuffer,
        cubeEAO : indexBufferEAO,
    };
}

function drawScene(gl, shaderStruct, buffers, texture, deltatime)
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
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.uvVBO);
    gl.vertexAttribPointer(shaderStruct.attribLocations.uv, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(shaderStruct.attribLocations.uv);

    //enable normal attribute
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.normalVBO);
    gl.vertexAttribPointer(shaderStruct.attribLocations.normal, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(shaderStruct.attribLocations.normal);

    //construct the inverse transpose matrix to convert normals without scaling artifacts
    const normMatrix = mat4.create();
    mat4.invert(normMatrix, view_model);
    mat4.transpose(normMatrix, normMatrix);
    
    gl.useProgram(shaderStruct.program);
    gl.uniformMatrix4fv(shaderStruct.uniformLocations.normalMatrix, false, normMatrix);
    gl.uniformMatrix4fv(shaderStruct.uniformLocations.projection, false, projectionMatrix);
    gl.uniformMatrix4fv(shaderStruct.uniformLocations.view_model, false, view_model);
    
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.uniform1i(shaderStruct.uniformLocations.texSampler, 0/*0 corresponds to gl.TEXTURE0*/);

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
        attribute vec3 vertNormal;
        attribute vec2 texUVCoord;

        uniform mat4 view_model;
        uniform mat4 projection;
        uniform mat4 normalMatrix; //the inverse transpose of the view_model matrix

        //notice the use of highp instead of lowp
        varying highp vec2 uvCoord; //this is like an out variable in opengl3.3+
        varying highp vec3 lightingColor;

        void main(){
            gl_Position = projection * view_model * vertPos;
            uvCoord = texUVCoord;

            highp vec3 ambient = vec3(0.3,0.3,0.3);
            highp vec3 dirLightColor = vec3(1,1,1);
            highp vec3 dirLight_dir = normalize(vec3(0.85, 0.8, 0.75));
            highp vec4 transformedNormal = normalMatrix * vec4(vertNormal, 1.0);

            highp float directionalIntensity = max(dot(transformedNormal.xyz, dirLight_dir), 0.0);
            lightingColor = ambient + (dirLightColor * directionalIntensity);
        }
    `;
    const fragSrc = `
        varying highp vec2 uvCoord;
        varying highp vec3 lightingColor;
        
        uniform sampler2D diffuseTexSampler;

        void main(){
            highp vec4 textureColor = texture2D(diffuseTexSampler, uvCoord);
            gl_FragColor = vec4(textureColor.rgb * lightingColor, textureColor.a);
        }
    `;
    const shader = initShaderProgram(gl, vertSrc, fragSrc);
    const shaderStruct = {
        program : shader,
        attribLocations : {
            pos: gl.getAttribLocation(shader, "vertPos"),
            uv: gl.getAttribLocation(shader, "texUVCoord"),
            normal: gl.getAttribLocation(shader, "vertNormal"),
        },
        uniformLocations : {
            projection : gl.getUniformLocation(shader, "projection"),
            view_model : gl.getUniformLocation(shader, "view_model"),
            normalMatrix : gl.getUniformLocation(shader, "normalMatrix"),
            texSampler : gl.getUniformLocation(shader, "diffuseTexSampler"),
        },
    };

    const buffers = initBuffers(gl);
    const cubeTexture = loadTexture(gl, "./Grass2.png");

    var prevSec = 0
    function renderLoopCallback(nowMS)
    {
        nowSec = nowMS * 0.001;
        const deltatime = nowSec - prevSec;
        drawScene(gl, shaderStruct, buffers, cubeTexture, deltatime); //seems wasteful to keep re-configuring vertext attrib, but this is a tutorial
        prevSec = nowSec;

        requestAnimationFrame(renderLoopCallback);
    }
    requestAnimationFrame(renderLoopCallback);
}
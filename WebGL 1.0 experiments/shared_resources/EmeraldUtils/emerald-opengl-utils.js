import {vec3} from "../gl-matrix_esm/index.js"
import {vec4} from "../gl-matrix_esm/index.js"
import {quat} from "../gl-matrix_esm/index.js"
import {mat4} from "../gl-matrix_esm/index.js"
import * as key from "../EmeraldUtils/browser_key_codes.js";

/////////////////////////////////////////////////////////////////////////////////
// Useful Geometries
/////////////////////////////////////////////////////////////////////////////////

/*
    Special thanks to mozzila for putting the tutorials on webgl1 together. That
    helped a lot to make the transition.
    https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Tutorial
    Some of the geometries below are based on that tutorial series.
*/
export const unitCubePositions = [
    // Front face
    -0.5, -0.5,  0.5,
     0.5, -0.5,  0.5,
     0.5,  0.5,  0.5,
    -0.5,  0.5,  0.5,
    
    // Back face
    -0.5, -0.5, -0.5,
    -0.5,  0.5, -0.5,
     0.5,  0.5, -0.5,
     0.5, -0.5, -0.5,
    
    // Top face
    -0.5,  0.5, -0.5,
    -0.5,  0.5,  0.5,
     0.5,  0.5,  0.5,
     0.5,  0.5, -0.5,
    
    // Bottom face
    -0.5, -0.5, -0.5,
     0.5, -0.5, -0.5,
     0.5, -0.5,  0.5,
    -0.5, -0.5,  0.5,
    
    // Right face
     0.5, -0.5, -0.5,
     0.5,  0.5, -0.5,
     0.5,  0.5,  0.5,
     0.5, -0.5,  0.5,
    
    // Left face
    -0.5, -0.5, -0.5,
    -0.5, -0.5,  0.5,
    -0.5,  0.5,  0.5,
    -0.5,  0.5, -0.5,
  ];

export const unitCubeNormals = [
    // Front face
     0.0,  0.0,  1.0,
     0.0,  0.0,  1.0,
     0.0,  0.0,  1.0,
     0.0,  0.0,  1.0,

    // Back face 
     0.0,  0.0, -1.0,
     0.0,  0.0, -1.0,
     0.0,  0.0, -1.0,
     0.0,  0.0, -1.0,

    // Top face
     0.0,  1.0,  0.0,
     0.0,  1.0,  0.0,
     0.0,  1.0,  0.0,
     0.0,  1.0,  0.0,

    // Bottom face 
     0.0, -1.0,  0.0,
     0.0, -1.0,  0.0,
     0.0, -1.0,  0.0,
     0.0, -1.0,  0.0,

    // Right face
     1.0,  0.0,  0.0,
     1.0,  0.0,  0.0,
     1.0,  0.0,  0.0,
     1.0,  0.0,  0.0,

    // Left face 
    -1.0,  0.0,  0.0,
    -1.0,  0.0,  0.0,
    -1.0,  0.0,  0.0,
    -1.0,  0.0,  0.0
];

export const unitCubeUVs = [
    // Front face
    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0,
    // Back face
    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0,
    // Top face
    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0,
    // Bottom face
    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0,
    // Right face
    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0,
    // Left face 
    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0,
];

export const unitCubeIndices = [
    0,  1,  2,      0,  2,  3,    // front face
    4,  5,  6,      4,  6,  7,    // back face
    8,  9,  10,     8,  10, 11,   // top face
    12, 13, 14,     12, 14, 15,   // bottom face
    16, 17, 18,     16, 18, 19,   // right face
    20, 21, 22,     20, 22, 23,   // left face
];

export const quad2DPositions = [
    -0.5,-0.5,    0.5,-0.5,    0.5,0.5, //triangle 1
    -0.5,-0.5,    0.5,0.5,    -0.5,0.5, //triangle 2
];

export const quad3DPositions = [
    -0.5,-0.5,0.0,    0.5,-0.5,0.0,    0.5,0.5,0.0, //triangle 1
    -0.5,-0.5,0.0,    0.5,0.5,0.0,    -0.5,0.5,0.0, //triangle 2
];

export const quad3DPositions_pivotBottomLeft = [
    0.0,0.0,0.0,    1.0,0.0,0.0,    1.0,1.0,0.0, //triangle 1
    0.0,0.0,0.0,    1.0,1.0,0.0,    0.0,1.0,0.0, //triangle 2
];

export const quad3DNormals = [
    0.0,0.0,1.0,    0.0,0.0,1.0,    0.0,0.0,1.0, //triangle 1
    0.0,0.0,1.0,    0.0,0.0,1.0,    0.0,0.0,1.0, //triangle 2
];

export const quadFlippedUVs = [
    0.0,1.0,    1.0,1.0,    1.0,0.0, //triangle 1
    0.0,1.0,    1.0,0.0,    0.0,0.0, //triangle 2
];

quad3DPositions_pivotBottomLeft

/////////////////////////////////////////////////
// Shader Utils
/////////////////////////////////////////////////

export function loadShader(gl, glShaderType, srcStr)
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

export function initShaderProgram(gl, vertSrc, fragSrc)
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

///////////////////////////////////////////////////////
// Rendering Line Utils
///////////////////////////////////////////////////////

//for use with a shear shader that sets up where the first (x axis) and second (y axis) should land; see shader below
export const linePointPositions = 
[
    1.0, 0.0, 0.0, //x-axis to transform with shear; this is the start point in the line
    0.0, 1.0, 0.0  //y-axis to transform with shear; this is the end point in the line.
];



const simpleLineShader_vs = 
`
    attribute vec3 position;

    uniform mat4 model; //the shear matrix
    uniform mat4 view;
    uniform mat4 projection;

    //shear matrix has useful property, each column is where the cooresponding base
    //vector will land. So, if we draw a line from points [1,0,0] and [0,1,0], then
    //we can abuse the shear matrix to specify where we want those points to land.
    // we just specify the matrix with columns where we want the points to land!
    // | firstX secondX 0 0 |
    // | firstY secondY 0 0 |
    // | firstZ secondZ 1 0 |
    // | 0       0      0 1 |
    void main(){
        gl_Position = projection * view * model * vec4(position, 1);
    }
`;
const simpleLineShader_fs = 
`
    uniform highp vec3 color;

    void main(){
        gl_FragColor = vec4(color, 1);
    }
`;


export function createShearMatrixForPoints(pntA, pntB)
{
    return mat4.fromValues(
        pntA[0], pntA[1], pntA[2], 0, //col 1; transforms x-axis
        pntB[0], pntB[1], pntB[2], 0, //col 2; transforms y-axis
        0,          0,      1,     0, //col 3; transforms z-axis
        0,          0,      0,     1  //col 4
    );
}

/** This is somewhat-like immediate mod; which means it isn't the best way to render lines. The alternative
 *  way for rendering lines is to load the points you want up into a buffer, then draw that array buffer as lines
 *  This method uses a shear matrix trick to map the x-axis and y-axis basis vectors to the points provided and setting
 *  that matrix via a uniform. Thus, this really should be a debug tool or used sparingly because it will use a lot of draw
 *  calls to render simple line segements.
 */
export class LineRenderer
{
    constructor(gl)
    {
        if(!gl) { console.log("FAILURE: cannot create LineRender, gl is null"); return;}

        this.gl = gl;
        this.shader = this._generateShader(gl);
        this.lineVBO = this._generateBuffer(gl);
    }

    renderLine(pntA, pntB, color, view_mat, projection_mat)
    {
        let gl = this.gl;
        gl.bindBuffer(gl.ARRAY_BUFFER, this.lineVBO);
        gl.vertexAttribPointer(this.shader.attribs.pos, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(this.shader.attribs.pos);

        let shearMat = createShearMatrixForPoints(pntA, pntB);

        gl.useProgram(this.shader.program);
        gl.uniformMatrix4fv(this.shader.uniforms.model, false, shearMat);
        gl.uniformMatrix4fv(this.shader.uniforms.view, false, view_mat);
        gl.uniformMatrix4fv(this.shader.uniforms.projection, false, projection_mat);
        gl.uniform3f(this.shader.uniforms.color, color[0], color[1], color[2]);

        gl.drawArrays(gl.LINES, 0, 2);
    }

    _generateShader(gl)
    {
        let glProgram = initShaderProgram(gl, simpleLineShader_vs, simpleLineShader_fs);
        return { 
            program : glProgram,
            attribs : {
                pos: gl.getAttribLocation(glProgram, "position"),
            },
            uniforms : {
                model : gl.getUniformLocation(glProgram, "model"),
                view  : gl.getUniformLocation(glProgram, "view"),
                projection : gl.getUniformLocation(glProgram, "projection"),
                color : gl.getUniformLocation(glProgram, "color"),
            }
        }
    }
    _generateBuffer(gl)
    {
        const axisPosVbo = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, axisPosVbo);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(linePointPositions), gl.STATIC_DRAW);
        return axisPosVbo
    }
}

///////////////////////////////////////////////////////
// Texture Utils
///////////////////////////////////////////////////////

export function isPowerOf2(value)
{
    //powers of 2 should only occupy a single bit; use bitwise operators to ensure this is true
    return (value & (value - 1)) == 0
}

export function loadTextureGL(gl, url)
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
    image.onload = function(){ 
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
    image.src = url;
    return texture;
}

export class Texture
{
    constructor(gl, fileURL)
    {
        this.gl;
        this.glTextureId = this._createTextureGL(gl);
        this.srcImage = this._createImage(gl, this.glTextureId, fileURL);
    }

    _createTextureGL(gl)
    {
        const textureID = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, textureID);
        
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

        return  textureID;
    }
    _createImage(gl, glTextureId, url)
    {
        let image = new Image();

        image.onload = function(){ 

            //image is now loaded once this callback is hit
            gl.bindTexture(gl.TEXTURE_2D, glTextureId);
            const level = 0;
            const internalFormat = gl.RGBA;
            const srcFormat = gl.RGBA;
            const srcType = gl.UNSIGNED_BYTE;
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
        //start load through javascript setters
        image.src = url; 

        return image;
    }
}

/////////////////////////////////////////////////////////////////////////////////
// Shaders
/////////////////////////////////////////////////////////////////////////////////




/////////////////////////////////////////////////////////////////////////////////
// Browser Utils
/////////////////////////////////////////////////////////////////////////////////

export function getBrowserSize(){
    //newer browsers should support window.innerWidth, but returning all for backwards compatibility
    var w = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    var h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

    return {
        width : w,
        height : h,
    }
}

///////////////////////
// pointer lock utils
///////////////////////

export const supportPointerLock =  "pointerLockElement" in document ||
    "mozPointerLockElement" in document ||
    "webkitPointerLockElement" in document;

export function configureMultiBrowserPointerLock(glCanvas)
{
    glCanvas.requestPointerLock = glCanvas.requestPointerLock || glCanvas.mozrequestPointerLock || glCanvas.webkitrequestPointerLock;
}

export function configureExitPoitnerLock()
{
    document.exitPointerLock = document.exitPointerLock || document.mozexitPointerLock || document.webkitexitPointerLock;
}

export function addEventListener_pointerlockchange(functionObj, useCapture = false)
{
    document.addEventListener("pointerlockchange",       functionObj, useCapture);
    document.addEventListener("mozpointerlockchange",    functionObj, useCapture);
    document.addEventListener("webkitpointerlockchange", functionObj, useCapture);
}

export function addEventListener_pointerlockerror(functionObj, useCapture = false)
{
    document.addEventListener("pointerlockerror",        this.handlePointerLockError.bind(this), useCapture);
    document.addEventListener("mozpointerlockerror",     this.handlePointerLockError.bind(this), useCapture);
    document.addEventListener("webkitpointerlockerror",  this.handlePointerLockError.bind(this), useCapture);
}

export function isElementPointerLocked(element)
{
    return document.pointerLockElement  === element 
        ||  document.mozpointerLockElement  === element
        ||  document.webkitpointerLockElement === element;
}
///////////////
// end pointer lock utils
///////////////


/////////////////////////////////////////////////////////////////////////////////
// Math Utils
/////////////////////////////////////////////////////////////////////////////////

export const radiansPerDegree = Math.PI / 180;
export const degreesPerRadian = 180 / Math.PI;

export function floatsAreSame(a, b, epsilon = 0.001)
{
    return Math.abs(a - b) < epsilon;
}

let vec3Same_buffer = vec3.create();
export function vec3AreSame(a, b, epsilon = 0.001)
{
    //create a vector between the two vectors, and theen see if its length is 0
    let length = vec3.length(vec3.subtract(vec3Same_buffer, a, b));
    return Math.abs(length) < epsilon;
}

let vec4Same_buffer = vec4.create();
export function vec4AreSame(a, b, epsilon = 0.001)
{
    //create a vector between the two vectors, and theen see if its length is 0
    let length = vec4.length(vec4.subtract(vec4Same_buffer, a, b));
    return Math.abs(length) < epsilon;
}

export function getDifferentVector(out, vec)
{
    
    let vecx = out[0] = vec[0];
    let vecy = out[1] = vec[1];
    let vecz = out[2] = vec[2];

    if (vecx < vecy && vecz)
    {
        out[0] = 1.0;
    }
    else if (vecy < vecx && vecz)
    {
        out[1] = 1.0;
    }
    else if (vecz < vecx && vecy)
    {
        out[2] = 1.0;
    }
    else //all are equal
    {
        if (vec.x > 0)
        {
            out[0] = -1.0;
        }
        else
        {
            out[0] = 1.0;
        }
    }
    return out;
}


/////////////////////////////////////////////////////////////////////////////////
// Camera
/////////////////////////////////////////////////////////////////////////////////

export function crossAndNormalize(a, b)
{
    let result = vec3.cross(vec3.create(), a, b);
    return vec3.normalize(result, result);
}

export class Camera
{
    constructor(
        position_vec3 = vec3.fromValues(0,0,0),
        forward_vec3 = vec3.fromValues(0,0,-1),
        up_vec3 = vec3.fromValues(0,1,0),
        speed_f = 10.0,
        inputMonitor = new key.InputMonitor()
    )
    {
        //fields
        this.position = position_vec3;
        this.forward = forward_vec3;
        this.up = up_vec3;
        this.speed = speed_f;
        this.right = null;
        this.rotation = quat.create();
        this.inputMonitor = inputMonitor;
        this.enableInput = true;
        this.enableMouseFollow = false;
        
        //perspective fields
        this.FOV_degrees = 45 * (Math.PI/180);
        this.zNear = 0.1;
        this.zFar = 100;
        
        //fps camera mode
        this.yaw = 0;
        this.pitch = 0;
        this.fpsYawSensitivity = 0.1;
        this.fpsPitchSensitivity = 0.1;
        
        //free camera mode
        this._freeCameraSensitivity = 0.0025;
        
        //set the current mode
        this.notifyMouseMoved_fptr = this.notifyMouseMoved_fpsCamera;

        //helper fields to avoid large number of object creation
        this.vec3buffer1 = vec3.create();
        this.vec3buffer2 = vec3.create();
        this.vec3buffer3 = vec3.create();
        this.vec3buffer4 = vec3.create();
        this.vec3buffer5 = vec3.create();
        this._worldUp = vec3.fromValues(0, 1, 0);
        this._cachedStartForward = vec3.clone(forward_vec3);
        this._cachedStartUp = vec3.clone(up_vec3);
        this._cachedRight = crossAndNormalize(this._cachedStartForward, this._cachedStartUp);

        //initialize
        this._squareBases();
        this._bindCallbacks();
    }

    _squareBases()
    {
        if(vec3AreSame(this.forward, this.up, 0.00001))
        {
            this.up = getDifferentVector(this.up, this.up);
        } 

        this.right = vec3.cross(vec3.create(), this.forward, this.up);
        this.up = vec3.cross(this.up, this.right, this.forward);

        vec3.normalize(this.right, this.right);
        vec3.normalize(this.forward, this.forward);
        vec3.normalize(this.up, this.up);

    }

    _bindCallbacks()
    {
        document.addEventListener('mousemove', this.handleMouseMoved.bind(this));
    }

    handleMouseMoved(e)
    {
        if(this.enableMouseFollow)
        {
            var movX = e.movementX || e.mozMovementX || e.webkitMovementX || 0.0;
            var movY = e.movementY || e.mozMovementY || e.webkitMovementY || 0.0;
            this.notifyMouseMoved_fptr(movX, movY);
        }
    }


    notifyMouseMoved_freeCamera(deltaX, deltaY)
    {
        deltaY = -deltaY;
        if(deltaX == 0.0 && deltaY == 0.0)
        {
            return;
        }

        // there's probably a better way to do this, just creating off the top of my head
        let scaledU = vec3.copy(vec3.create(), this.right);
        vec3.scale(scaledU, scaledU, deltaX);

        let scaledV = vec3.copy(vec3.create(), this.up);
        vec3.scale(scaledV, scaledV, deltaY);

        let rotDir = vec3.add(vec3.create(), scaledU, scaledV);

        let rotationAxis = vec3.cross(vec3.create(), this.forward, rotDir);
        vec3.normalize(rotationAxis, rotationAxis);
        
        let rotMagnitude = (Math.abs(deltaX) + Math.abs(deltaY))  * this._freeCameraSensitivity;
        let rotQuat = quat.setAxisAngle(quat.create(), rotationAxis, rotMagnitude);

        vec3.transformQuat(this.forward, this.forward, rotQuat);
        this._squareBases();
    }

    notifyMouseMoved_fpsCamera(deltaX, deltaY)
    {
        //yaw and pitch are relative to the starting forward vector.
        this.yaw = this.yaw + (-deltaX * this.fpsYawSensitivity);
        this.pitch = this.pitch + (-deltaY * this.fpsPitchSensitivity);

        if(this.pitch > 89.0) {this.pitch = 89.0;}
        if(this.pitch < -89.0) {this.pitch = -89.0;}
        this.yaw = this.yaw % 360.0;

        // console.log("yaw %.2f, pitch %.2f", this.yaw, this.pitch);
        let yawRad = radiansPerDegree * this.yaw;
        let pitchRad = radiansPerDegree * this.pitch;
        let rotQuat = null;
        { //scope pitch/yaw quats so their memory can be reused in rotQuat
            let pitchQuat = quat.setAxisAngle(quat.create(), this._cachedRight, pitchRad);
            let yawQuat = quat.setAxisAngle(quat.create(), this._worldUp, yawRad);
            rotQuat = quat.multiply(pitchQuat, yawQuat, pitchQuat); //use pitchQuat as storage
        }

        vec3.transformQuat(this.forward, this._cachedStartForward, rotQuat);
        vec3.transformQuat(this.up, this._worldUp, rotQuat); //also rotate this since its used ins base squaring

        this._squareBases();
    }

    getPerspective(aspect)
    {
        return mat4.perspective(mat4.create(), this.FOV_degrees, aspect, this.zNear, this.zFar);
    }

    getView()
    {
        //set target to be right in front of the camera's position
        let target = vec3.add(vec3.create(), this.position, this.forward);
        return mat4.lookAt(mat4.create(), this.position, target, this.up);
    }

    tick(deltaTimeSec)
    {
        if(this.enableInput)
        {
            let dir = this.vec3buffer1;
            vec3.set(dir, 0,0,0);
            if(this.inputMonitor.pressedStateArray[key.up] || this.inputMonitor.pressedStateArray[key.w])
            {
                let upDir = vec3.copy(this.vec3buffer2, this.forward);
                dir = vec3.add(dir, dir, upDir);
            }
            if (this.inputMonitor.pressedStateArray[key.down]|| this.inputMonitor.pressedStateArray[key.s])
            {
                let downDir = vec3.copy(this.vec3buffer2, this.forward);
                vec3.scale(downDir, downDir, -1);
                dir = vec3.add(dir, dir, downDir);
            }
            if (this.inputMonitor.pressedStateArray[key.right] || this.inputMonitor.pressedStateArray[key.d])
            {
                let rightDir = vec3.copy(this.vec3buffer2, this.right);
                dir = vec3.add(dir, dir, rightDir);
            }
            if (this.inputMonitor.pressedStateArray[key.left] || this.inputMonitor.pressedStateArray[key.a])
            {
                let leftDir = vec3.copy(this.vec3buffer2, this.right);
                vec3.scale(leftDir, leftDir, -1);
                dir = vec3.add(dir, dir, leftDir);
            }
            vec3.normalize(dir, dir);
            vec3.scale(dir, dir, this.speed * deltaTimeSec);

            vec3.add(this.position, this.position, dir);
        }
    }
}
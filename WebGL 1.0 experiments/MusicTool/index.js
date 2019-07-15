import * as EmeraldUtils from "../shared_resources/EmeraldUtils/emerald-opengl-utils.js";
import {UnitCube3D, texturedCubeFactory, coloredCubeFactory} from "../shared_resources/EmeraldUtils/emerald_easy_shapes.js";
import * as key from "../shared_resources/EmeraldUtils/browser_key_codes.js";
import {Camera} from "../shared_resources/EmeraldUtils/emerald-opengl-utils.js";
import {vec2, vec3, vec4, mat4} from "../shared_resources/gl-matrix_esm/index.js";
import {RenderBox3D, GlyphRenderer} from "../shared_resources/EmeraldUtils/BitmapFontRendering.js"
import * as BMF from "../shared_resources/EmeraldUtils/BitmapFontRendering.js"
import { Montserrat_BMF } from "../shared_resources/EmeraldUtils/Montserrat_BitmapFontConfig.js";
import { Piano } from "../shared_resources/EmeraldUtils/music_tools.js";



//////////////////////////////////////////////////////
//module level statics
//////////////////////////////////////////////////////
var game = null;


//////////////////////////////////////////////////////
// Shaders
//////////////////////////////////////////////////////


//////////////////////////////////////////////////////
// Base Game Class
//////////////////////////////////////////////////////
class Game
{
    constructor(glCanvasId = "#glCanvas")
    {
        this.glCanvas = document.querySelector(glCanvasId);
        this.gl = this.glCanvas.getContext("webgl");
        this.prevFrameTimestampSec = 0;

        this.inputMonitor = new key.InputMonitor();
        
        this.boundGameLoop = this.gameLoop.bind(this);
        
        // this.buffers = this._createBuffers(this.gl);
        // this.shaders = this._createShaders(this.gl);
        this.textures = this._createTextures(this.gl);
        
        ///////////////////////////////
        //custom game code
        this.coloredCube = coloredCubeFactory(this.gl);
        this.camera = new Camera(vec3.fromValues(0,0,1), vec3.fromValues(0,0,-1));
    
        //todo create a list of pianos?
        this.piano = new Piano(this.gl);

        //////////////////////////////
        
        this._bindCallbacks();
    }

    // _createBuffers(gl)
    // {
        
    // }

    _createTextures(gl){
        return {
            grass : new EmeraldUtils.Texture(gl, "../shared_resources/Grass2.png"),
            montserratFontWhite : new EmeraldUtils.Texture(gl, "../shared_resources/Montserrat_ss_alpha_white_power2.png"),
            montserratFontBlack : new EmeraldUtils.Texture(gl, "../shared_resources/Montserrat_ss_alpha_black_power2.png"),
            montserratFont : new EmeraldUtils.Texture(gl, "../shared_resources/Textures/Fonts/Montserrat_ss_alpha_1024x1024_wb.png"),
        }
    }

    // _createShaders(gl){
    //     let quad2DShader = EmeraldUtils.initShaderProgram(gl, quad2DVertSrc, quad2DFragSrc);
    //     return {
    //         quad2D : {
    //             program : quad2DShader,
    //             attribs : {
    //                 pos : gl.getAttribLocation(quad2DShader, "vertPos"),
    //                 uv : gl.getAttribLocation(quad2DShader, "texUVCoord"),
    //             },
    //             uniforms : {
    //                 model      : gl.getUniformLocation(quad2DShader, "model"),
    //                 texSampler : gl.getUniformLocation(quad2DShader, "diffuseTexSampler"),
    //             },
    //         },
    //     };
    // }

    _bindCallbacks()
    {
        document.addEventListener('keydown', this.handleKeyDown.bind(this), /*useCapture*/ false);
        if(EmeraldUtils.supportPointerLock)
        {
            this.glCanvas.addEventListener("click", this.handleCanvasClicked.bind(this), false);
            EmeraldUtils.configureMultiBrowserPointerLock(this.glCanvas);
            EmeraldUtils.addEventListener_pointerlockchange(this.handlePointerLockChange.bind(this));
        }
    }

    handleKeyDown(event)
    {
        let deltaMovement = vec3.fromValues(0,0,0);
        if(event.keyCode == key.up)
        {
            deltaMovement[0] = deltaMovement[0] + this.camera.up[0];
            deltaMovement[1] = deltaMovement[1] + this.camera.up[1];
            deltaMovement[2] = deltaMovement[2] + this.camera.up[2];
        }
        if(event.keyCode == key.down)
        {
            deltaMovement[0] = deltaMovement[0] + -this.camera.up[0];
            deltaMovement[1] = deltaMovement[1] + -this.camera.up[1];
            deltaMovement[2] = deltaMovement[2] + -this.camera.up[2];
        }
        if(event.keyCode == key.left)
        {
            deltaMovement[0] = deltaMovement[0] + -this.camera.right[0];
            deltaMovement[1] = deltaMovement[1] + -this.camera.right[1];
            deltaMovement[2] = deltaMovement[2] + -this.camera.right[2];
        }
        if(event.keyCode == key.right)
        {
            deltaMovement[0] = deltaMovement[0] + this.camera.right[0];
            deltaMovement[1] = deltaMovement[1] + this.camera.right[1];
            deltaMovement[2] = deltaMovement[2] + this.camera.right[2];
        }
        vec3.scale(deltaMovement, deltaMovement, this.camera.speed * this.deltaSec);
        vec3.add(this.camera.position, this.camera.position, deltaMovement);
    }

    handleCanvasClicked()
    {
        // this.glCanvas.requestPointerLock();
    }

    handlePointerLockChange()
    {
        // this.camera.enableMouseFollow = EmeraldUtils.isElementPointerLocked(this.glCanvas);
    }

    run()
    {
        requestAnimationFrame(this.boundGameLoop);
    }



    gameLoop(nowMS)
    {
        let gl = this.gl;

        let nowTimeSec = (nowMS * 0.001);
        let deltaSec = nowTimeSec - this.prevFrameTimestampSec;
        this.deltaSec = deltaSec;
        this.prevFrameTimestampSec = nowTimeSec;
        
        gl.enable(gl.DEPTH_TEST); 
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

        gl.clearColor(0.0, 0.0, 0.0, 1);
        gl.clearDepth(1.0); //value gl.clear() write to depth buffer; is this default value?
        gl.depthFunc(gl.LEQUAL);  //maybe default,?
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        /////////////////////////////////////
        // TICK
        /////////////////////////////////////
        // this.camera.tick(deltaMs);

        /////////////////////////////////////
        // RENDER
        /////////////////////////////////////

        //some of these may be appropriate for camera fields
        let aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
        let orthoHeightUnits = 10;
        let perspectiveMat = this.camera.getOrtho(aspect * orthoHeightUnits, orthoHeightUnits);
        // let perspectiveMat = this.camera.getPerspective(aspect);
        let viewMat = this.camera.getView();


        let coloredCubeModel = mat4.create();
        mat4.translate(coloredCubeModel, coloredCubeModel, vec3.fromValues(-1, 1, -7));
        let cubeColor = vec3.fromValues(1,0,0);

        this.coloredCube.bindBuffers();
        this.coloredCube.updateShader(coloredCubeModel, viewMat, perspectiveMat, cubeColor);
        this.coloredCube.render();


        //render piano
        this.piano.render(viewMat, perspectiveMat);

        requestAnimationFrame(this.boundGameLoop);
    }
}

function main()
{
    game = new Game();
    game.run();
}


main()
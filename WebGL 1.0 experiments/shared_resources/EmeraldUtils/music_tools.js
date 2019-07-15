import {vec3} from "../gl-matrix_esm/index.js"
import {vec4} from "../gl-matrix_esm/index.js"
import {quat} from "../gl-matrix_esm/index.js"
import {mat4} from "../gl-matrix_esm/index.js"
import * as key from "../EmeraldUtils/browser_key_codes.js";
import * as EmeraldUtils from "./emerald-opengl-utils.js"
import {Transform} from "./emerald-opengl-utils.js"
import { coloredCubeFactory, coloredCubeFactory_pivoted} from "./emerald_easy_shapes.js";


class PianoKey 
{
    constructor(keyXform, isWhiteKey)
    {
        this.xform = keyXform;
        this.isWhiteKey = isWhiteKey;
        this.baseColor = isWhiteKey ? vec3.fromValues(1,1,1) : vec3.fromValues(0,0,0);
    }

    getColor(){
        return this.baseColor;
    }
}

export class Piano
{
    constructor(gl)
    {
        this.gl = gl;
        this.pianoTransform = new Transform();
        this.cube = coloredCubeFactory_pivoted(gl);
        this.keyData = {
            whiteKey : {
                width : 1,
                height : 2,
            },
            blackKey : {
                width : 0.75,
                height : 1.25,
            },
            spacing : 0.1
        }
        this.octaves = 1;
        this._generateKeys();
    }

    _generateKeys()
    {
        let keyLocations = {
            c : {
                isWhiteKey : true,
                whiteKeyOffsets : 0,
                letter: 'c',
            },
            cSharp : {
                isWhiteKey : false,
                whiteKeyOffsets : 0,
                letter: 'c',
            },
            d : {
                isWhiteKey : true,
                whiteKeyOffsets : 1,
                letter: 'd',
            },
            dSharp : {
                isWhiteKey : false,
                whiteKeyOffsets : 1,
                letter: 'd',
            },
            e : {
                isWhiteKey : true,
                whiteKeyOffsets : 2,
                letter: 'e',
            },
            f : {
                isWhiteKey : true,
                whiteKeyOffsets : 3,
                letter: 'f',
            },
            fSharp : {
                isWhiteKey : false,
                whiteKeyOffsets : 3,
                letter: 'f',
            },
            g : {
                isWhiteKey : true,
                whiteKeyOffsets : 4,
                letter: 'g',
            },
            gSharp : {
                isWhiteKey : false,
                whiteKeyOffsets : 4,
                letter: 'g',
            },
            a : {
                isWhiteKey : true,
                whiteKeyOffsets : 5,
                letter: 'a',
            },
            aSharp : {
                isWhiteKey : false,
                whiteKeyOffsets : 5,
                letter: 'a',
            },
            b : {
                isWhiteKey : true,
                whiteKeyOffsets : 6,
                letter: 'b',
            }
        };


        this.keys = [];

        let whiteKeyOffset = this.keyData.whiteKey.width + this.keyData.spacing;
        let octaveSize = 7 * whiteKeyOffset;

        let baseOctave = 3;
        for(let octave = 0; octave < this.octaves; ++octave)
        {
            let startPos = vec3.fromValues(octave*octaveSize, 0, 0);
            let keyOffset = vec3.fromValues(0,0,0);
        
            for (const keyName in keyLocations) 
            {
                let key = keyLocations[keyName];

                keyOffset[0] = whiteKeyOffset * key.whiteKeyOffsets;
                keyOffset[1] = 0;
                keyOffset[2] = 0;
                if(!key.isWhiteKey)
                {
                    keyOffset[0] += (this.keyData.whiteKey.width + this.keyData.spacing / 2.0) - this.keyData.blackKey.width/2;
                    keyOffset[2] += 0.1;//push black keys up in z
                }

                let keyXform = new Transform();
                keyXform.pos[0] = startPos[0] + keyOffset[0];
                keyXform.pos[1] = keyOffset[1];
                keyXform.pos[2] = keyOffset[2];
                if(key.isWhiteKey)
                {
                    keyXform.scale[0] = this.keyData.whiteKey.width;
                    keyXform.scale[1] = this.keyData.whiteKey.height;
                }
                else
                {
                    keyXform.scale[0] = this.keyData.blackKey.width;
                    keyXform.scale[1] = this.keyData.blackKey.height;
                }
                
                //TODO pass key's octave to ctor and have key generate sound file name
                this.keys.push(new PianoKey(keyXform, key.isWhiteKey));
            }
        }
    }

    render(viewMat, projectionMat)
    {
        this.cube.bindBuffers();
        
        let modelMat = mat4.create();
        for(const key of this.keys)
        {
            this.cube.updateShader(key.xform.toMat4(modelMat), viewMat, projectionMat, key.getColor());
            this.cube.render();
        }
    }
}
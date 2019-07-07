import * as BMF from "./BitmapFontRendering.js"

export class Montserrat_BMF extends BMF.BitmapFont
{
    constructor(glContext, textureURL)
    {
        super(glContext, textureURL);
        
        this._configureGlyphTable();
    }

    _configureGlyphTable()
    {
        //this method should only ever be called once
    }

}
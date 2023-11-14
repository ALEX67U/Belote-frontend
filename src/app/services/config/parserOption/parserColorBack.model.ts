import * as THREE from "three";
import { ParserOption } from "./parserOption.model";

export class ParserColorBack extends ParserOption
{
   
    constructor()
    {
        super();
        this.value = new THREE.Color();
        this.nameSave = "colorBackground"
    }

    override setValue(value: any): any {
        this.value.copy(value)

        return this.value
    }
    
    override save(): void 
    {
        const color = "["+ this.value.r + "," + this.value.g + "," + this.value.b + "]";
        localStorage.setItem(this.nameSave,color);
    }

    override load(): boolean
    {
        const saveColor = localStorage.getItem(this.nameSave)
        if(saveColor)
        {
            const color = JSON.parse(saveColor)
            this.value.set(color[0],color[1],color[2]);
            return true
        }
        return false
    }

    override default(data: any): void 
    {
        this.value.set(data.colorBackground[0],data.colorBackground[1],data.colorBackground[2]);
    }

    override tryLoad(data: any): void 
    {
        if(!this.load())
        {
            this.default(data);
        }
    }
}
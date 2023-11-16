import { ParserOption } from "./parserOption.model";

export class ParserSkybox extends ParserOption
{
    constructor()
    {
        super();
        this.value = new Number(0);
        this.nameSave = "skybox"
    }

    override setValue(value: any): any {
        return this.value = value
    }
    
    override save(): void 
    {
        localStorage.setItem(this.nameSave,this.value.toString());
    }

    override load(): boolean
    {
        const save= localStorage.getItem(this.nameSave)
        if(save)
        {
            this.value = parseInt(save);
            return true
        }
        return false
    }

    override default(data: any): void 
    {
        this.value = data.skybox
    }

    override tryLoad(data: any): void 
    {
        if(!this.load())
        {
            this.default(data);
        }
    }
}
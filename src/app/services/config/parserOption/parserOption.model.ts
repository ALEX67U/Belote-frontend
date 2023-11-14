export abstract class ParserOption 
{
    private successor : ParserOption | null;
    protected nameSave !: string
    protected value : any = null;

    constructor(successor = null) 
    {
        this.successor = successor;
    }

    public setSuc(successor : ParserOption) : ParserOption 
    {
        this.successor = successor;
        return this
    }

    public getValue() : any
    {
        return this.value;
    }

    abstract setValue(value : any) : any

    abstract save() : void

    abstract load() : boolean 

    abstract default(data : any) : void

    abstract tryLoad(data : any) : void

    public handleRequest(data : any, option : string) : void
    {
        if (data) 
        {
            if (this.parse(data,option) && (this.successor !== null)) 
            {
                return this.successor.handleRequest(data,option);
            }
        }         
    }

    parse(data : any , option : string) : boolean 
    {
        if (option == "save") 
        {
            this.save();
            return true;
        }
        else if(option == "load")
        {
            if(this.nameSave)
            {
                this.load();
                return true;
            }
            else
            {
                console.error("Error : nameSave is not defined in :" , this)
            }
        }
        else if(option == "default")
        {
            this.default(data)
            return true;
        }
        else if(option == "tryLoad")
        {
            this.tryLoad(data)
            return true;
        }
        return false
    }
}
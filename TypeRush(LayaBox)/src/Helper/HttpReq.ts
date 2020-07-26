
//Http请求对象
export default class HttpReq
{
    public static SUCC:Number = 200;

    private _callback: any;
    private _caller: any;
 
    public http:Laya.HttpRequest;
 
    constructor() 
    {
        this.http = new Laya.HttpRequest;
    }
 
    public Get(url:string, caller:any, callback:any): HttpReq
    {
        this._caller = caller;
        this._callback = callback;
		this.http.once(Laya.Event.COMPLETE, this, this.onHttpRequestComplete);
		this.http.once(Laya.Event.ERROR, this, this.onHttpRequestError);
        this.http.send(url, null, 'get', 'json');
        return this;
    }
 
    public Post(url:string, data:any, contentType:string, caller:any, callback:any): HttpReq
    {
        this._caller = caller;
        this._callback = callback;
		this.http.once(Laya.Event.COMPLETE, this, this.onHttpRequestComplete);
		this.http.once(Laya.Event.ERROR, this, this.onHttpRequestError);
        if(contentType == null)
            this.http.send(url, data, 'post', 'json');
        else
            this.http.send(url, data, 'post', 'json',["content-type",contentType]);
        
        return this;
    }
 
 
    private onHttpRequestError(e: any): void 
    {
        this._callback.apply(this._caller, [{State:500, Msg:e}]);
    }
 
    private onHttpRequestComplete(e: any): void 
    {
        this._callback.apply(this._caller, [{State:200, Data:this.http.data}]);
    }
}
 

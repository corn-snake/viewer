import mapObject from "./mapObject.ts";

interface FancyRequest extends Request {
    path: string;
};

class Router{
    toggleDev: ()=>boolean;
    registeredRoutes: Map<any,any>;
    method: (method: string)=>({newRoute: (match: string | symbol, callback: (req: FancyRequest | Request,res?: Response,next?: (..._args: any[])=>Promise<Response>|Response)=>Promise<Response>|Response)=>Router});
    post: (match: string | symbol, callback: (req: FancyRequest |Request,res?: Response,next?: (..._args: any[])=>Promise<Response>|Response)=>Promise<Response>|Response)=>Router;
    get: (match: string | symbol, callback: (req: FancyRequest |Request,res?: Response,next?: (..._args: any[])=>Promise<Response>|Response)=>Promise<Response>|Response)=>Router;
    put: (match: string | symbol, callback: (req: FancyRequest |Request,res?: Response,next?: (..._args: any[])=>Promise<Response>|Response)=>Promise<Response>|Response)=>Router;
    init: ()=>any;
    constructor({dev}={dev:false}) {
        this.toggleDev = ()=>dev = !dev;
        this.registeredRoutes = mapObject();
        this.method = (method="")=>{
            if(!(this.registeredRoutes.has[method]))
                this.registeredRoutes[method] = [];
            return {
                newRoute: (match, callback)=> {
                    this.registeredRoutes[method].push({match,callback: (r,s?,n?)=>{
                        const c = callback;
                        if (!dev)
                            return c(r);
                        return c(r,s,n);
                    }});
                    return this;
                }
            }
        };
        this.post = this.method("POST").newRoute;
        this.get = this.method("GET").newRoute;
        this.put = this.method("PUT").newRoute;
        this.init = ()=> dev ?
            (req: FancyRequest,res: Response,next: (..._args:[])=>Promise<Response>|Response)=>{
                if (!(this.registeredRoutes.has(req.method.toUpperCase())))
                    return new Response("Method not allowed.",{status: 404});
                for (const i of this.registeredRoutes[req.method])
                    if (req.path.match(new RegExp(`^${i.match.startsWith("/") ? "" : "\/"}${i.match}`)))
                        return i.callback(req,res,next);
                next();
            } :
            (r: Request)=>{
                if (!(this.registeredRoutes.has(r.method.toUpperCase())))
                    return new Response("Method not allowed.",{status: 404});
                const url = new URL(r.url);
                for (const i of this.registeredRoutes[r.method]){
                    if (url.pathname.match(new RegExp(`^${i.match.startsWith("/") ? "" : "\/"}${i.match}(\/|$)`)) !== null)
                        return i.callback(r);
                }
                return new Response(`${r.method.toUpperCase()} ${url.pathname} not found.`, {status:404})
            };
        return this;
    }
};

export default Router;
function mapObject(_m: Map<string,any> | Array<any> = new Map<any,any>()) {
    const _a = Array.isArray(_m) ? new Map<any,any>(_m) : _m;
    const _h: ProxyHandler<Map<any, any>> = {
        get(target: Map<any,any>,name: any,_receiver: any){
            switch(name){
                case "keys":
                    return [...target.keys()];
                case "reset":
                case "clear":
                    return target.clear;
                case "has":
                    return (th: any)=>target.has(th);
                case "set":
                    return target.set;
                case "del":
                case "delete":
                case "remove":
                    return (th:any)=>target.delete(th);
                case "valueOf":
                    return ()=>[...target.entries()];
                case "toString":
                    return ()=>`{${[...target.keys()].map((e)=>`"${e}":${JSON.stringify(target.get(e))}`).join(',')}}`;
                case "toJSON":
                    return ()=>Object.fromEntries(target.entries());
                default:
                    return target.get(name);
            }
        },
        set: (target: Map<any,any>,name: any,value: any,_receiver: any)=>{
            try {
                target.set(name,value);
                return true;
            } catch {
                return false;
            }
        }
    };
    const _p = new Proxy<Map<any,any>>(_a,_h);
    return _p;
}

export default mapObject;
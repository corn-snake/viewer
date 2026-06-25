class Lighthouse {
    value = undefined,
    _effects = [],
    constructor(v){
        this.value = v;
        update(v){
            if (typeof this.value !== typeof v) throw new TypeError("Cannot change variable type!");
            this.value = v;
        },
        setEffect(){
            isRendering._effects.push;
        }
    }
}
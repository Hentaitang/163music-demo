window.eventHub = {
    events: {},
    emit(eventName, data){ // 发布
        for(let key in this.events){
            if(eventName === key){
                this.events[key].map((fn)=>{
                    fn.call(undefined, data)
                })
            }
        }
    },
    on(eventName, fn){ // 订阅
        if(this.events[eventName] === undefined){
            this.events[eventName] = []
        }
        this.events[eventName].push(fn)
    }
}
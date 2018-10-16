{
    let view = {
        el: '#app',
        template: `
            <audio controls src={{url}}></audio>
            <div>
                <button class="play">播放</button>
                <button class="pause">暂停</button>
            <div>
        `,
        render(song){
            $(this.el).html(this.template.replace('{{url}}', song.url))
        },
        play(){
            let audio = $(this.el).find('audio')[0]
            audio.play()
        },
        pause(){
            let audio = $(this.el).find('audio')[0]
            audio.pause()
        }
    }
    let model = {
        data: {
            id: '',
            name: '',
            singer: '',
            url: ''
        },
        getSong(id){
            var query = new AV.Query('Song');
            return query.get(id).then((song)=>{
                Object.assign(this.data, {id: song.id, ...song.attributes})
                return song
            })
        }
    }
    let controller = {
        init(view, model){
            this.view = view
            this.model = model
            let id = this.getId()
            this.model.getSong(id).then(()=>{
                this.view.render(this.model.data)
            })
            this.bindEvent()
        },
        getId(){
            let search = window.location.search
            let id = ''
            if(search.indexOf('?') === 0){
                search = search.substring(1).split('&').filter((value => value))
            }
            for(i in search){
                let kv = search[i].split('=')
                let key = kv[0]
                let value = kv[1]
                if(key === 'id'){
                    id = value
                    break
                }
            }
            return id
        },
        bindEvent(){
            $(this.view.el).on('click', '.play', ()=>{
                this.view.play()
            })
            $(this.view.el).on('click', '.pause', ()=>{
                this.view.pause()
            })
        }
    }
    controller.init(view, model)
}
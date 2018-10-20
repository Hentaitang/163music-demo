{
    let view = {
        el: '#app',
        template: `
            <audio src={{url}}></audio>
        `,
        render(song){
            if(song.cover){
                $(this.el).find('.background').css('background-image', `url(${song.cover})`)
                $(this.el).find('.cover').attr('src', `${song.cover}`)
            }
            $(this.el).find('.information > h2').html(song.name+ ' - ' + `<span>${song.singer}</span>`)
            $(this.el).append(this.template.replace('{{url}}', song.url))
        },
        control(){
            if($(this.el).find('.dist-cover').hasClass('playing')){
                this.pause()
            }else{
                this.play()
            }
        },
        play(){
            $(this.el).find('.dist-cover').addClass('playing')
            let audio = $(this.el).find('audio')[0]
            audio.play()
        },
        pause(){
            $(this.el).find('.playing').removeClass('playing')
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
            $(this.view.el).on('click', '.wrapper > .cd > .dist-cover', ()=>{
                this.view.control()
            })
        }
    }
    controller.init(view, model)
}
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
            $(this.el).find('.download').attr('href', `${song.url}`)
            $(this.el).find('.information > h2').html(song.name+ ' - ' + `<span>${song.singer}</span>`)
            $(this.el).append(this.template.replace('{{url}}', song.url))
            $(this.el).find('audio')[0].onended = ()=>{
                this.pause()
            }
            this.lyrics(song.lyrics)
            $(this.el).find('audio')[0].ontimeupdate = (e)=>{
                let children = $(this.el).find('.lyrics  p')
                let time = e.path[0].currentTime
                let height = 0
                for(let i=0; i<children.length; i++){
                    let currentTime = $(children[i]).attr('time')
                    let nextTime = $(children[i+1]).attr('time')
                    if(children[i].offsetHeight === 28){
                        height += 28
                    }else if(children[i].offsetHeight === 56){
                        height += 56 
                    }
                    if(currentTime <= time && nextTime > time || currentTime && !nextTime){
                        $(children[i]).addClass('highlight').siblings().removeClass('highlight')
                        $(this.el).find('.lyrics-wrapper').css('transform', `translateY(-${height-28}px)`)
                        break
                    }
                }
            }
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
        },
        lyrics(strings){
            strings.split('\n').map((string)=>{
                string = string.match(/\[([\d:.]+)\](.+)/)
                let time = string[1].split(':')
                time = parseInt(time[0], 10)*60 +parseFloat(time[1], 10)
                $(this.el).find('.lyrics > .lyrics-wrapper').append(`<p time="${time}">${string[2]}</p>`)
            })
        }
    }
    let model = {
        data: {
            id: '',
            name: '',
            singer: '',
            url: '',
            cover: '',
            lyrics: ''
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
            $(this.view.el).on('click', '.open', ()=>{
                window.location.href = 'index.html'
            })
        }
    }
    controller.init(view, model)
}
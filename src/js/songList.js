{
    let view = {
        el: '.songList-container',
        template: `
        <ul class="songList"></ul>
        `,
        render(data) {
            $(this.el).html(this.template)
            let { songs } = data
            songs.map((song) => {
                $('ul').prepend($('<li></li>').attr('songId', song.id).append($('<div></div>').text(song.name)))
            })
        },
        clearActive() {
            $(this.el).find('.active').removeClass('active')
        },
        active(selector){
            $(selector).addClass('active').siblings('.active').removeClass('active')
        }
    }
    let model = {
        data: {
            songs: []
        },
        showData(){
            var query = new AV.Query('Song');
            return query.find().then((songs)=>{
                songs.forEach((song)=>{
                    let {id, attributes} = song
                    let data = {id, ...attributes}
                    this.data.songs.push(data)
                })
            })
        }
    }
    let controller = {
        init(view, model) {
            this.view = view
            this.model = model
            this.bindEventHub()
            this.view.render(this.model.data)
            this.bindEvents()
            this.model.showData().then(()=>{
                this.view.render(this.model.data)
            })
            
        },
        bindEvents(){
            $(this.view.el).on('click', 'li', (e)=>{
                this.view.active(e.currentTarget)
                let id = $(e.currentTarget).attr('songId')
                let data
                this.model.data.songs.map((song)=>{
                    if(id === song.id){
                        data = song
                    }
                })  
                window.eventHub.emit('select', JSON.parse(JSON.stringify(data)))
            })
        },
        bindEventHub(){
            window.eventHub.on('create', (data) => {
                this.model.data.songs.push(data)
                this.view.render(this.model.data)
            })
            window.eventHub.on('new', (data)=>{
                this.view.clearActive()
            })
            window.eventHub.on('update', (data)=>{
                this.model.data.songs.map((song)=>{
                    if(song.id === data.id){
                        Object.assign(song, data)
                    }
                })
                this.view.render(this.model.data)
                this.view.active(`[songid="${data.id}"]`)
            })
        }
    }
    controller.init(view, model)
    //命名空间实现模块数据交互
    // window.app.songList = controller
}
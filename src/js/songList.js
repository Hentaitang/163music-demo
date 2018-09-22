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
            this.view.render(this.model.data)
            window.eventHub.on('upload', () => {
                this.view.clearActive()
            })
            window.eventHub.on('create', (data) => {
                this.model.data.songs.push(data)
                this.view.render(this.model.data)
            })
            this.model.showData().then(()=>{
                this.view.render(this.model.data)
            })
            $(this.view.el).on('click', 'li', (e)=>{
                let li = e.currentTarget
                $(li).addClass('active').siblings().removeClass('active')
                let id = $(li).attr('songId')
                let data
                this.model.data.songs.map((song)=>{
                    if(id === song.id){
                        data = song
                    }
                })  
                window.eventHub.emit('selector', JSON.parse(JSON.stringify(data)))
                
            })
        }
    }
    controller.init(view, model)
    //命名空间实现模块数据交互
    // window.app.songList = controller
}
{
            // <li><div>歌曲1</div></li>
            // <li><div>歌曲2</div></li>
            // <li class="pre-active"><div>歌曲3</div></li>
            // <li class="active"><div>歌曲4</div></li>
            // <li><div>歌曲5</div></li>
            // <li><div>歌曲6</div></li>
            // <li><div>歌曲7</div></li>
            // <li><div>歌曲8</div></li>
            // <li><div>歌曲9</div></li>
            // <li><div>歌曲10</div></li>


    let view = {
        el: '.songList-container',
        template: `
        <ul class="songList"></ul>
        `,
        render(data){
            $(this.el).html(this.template)
            let {songs} = data
            songs.map((song)=>{
                $('ul').append($('<li></li>').append($('<div></div>').text(song.name)))
            })
        },
        clearActive(){
            $(this.el).find('.pre-active').removeClass('pre-active').next('.active').removeClass('active')
        }
    }
    let model = {
        data: {
            songs: []
        }
    }
    let controller = {
        init(view, model){
            this.view = view
            this.model = model
            this.view.render(this.model.data)
            window.eventHub.on('upload', ()=>{
                this.view.clearActive()
            })
            window.eventHub.on('create', (data)=>{
                this.model.data.songs.push(data)
                this.view.render(this.model.data)
            })
        }
    }
    controller.init(view, model)
    //命名空间实现模块数据交互
    // window.app.songList = controller
}
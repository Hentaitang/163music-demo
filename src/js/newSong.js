{
    let view = {
        el: '.newSong',
        template: `新建歌曲`,
        render(data){
            $(this.el).html(this.template)
        }
    }
    let model = {}
    let controller = {
        init(view, model){
            this.view = view
            this.model = model
            this.view.render(this.model.data)
            this.active()
            window.eventHub.on('upload', (data)=>{
                this.active()
            })
            window.eventHub.on('create', (data)=>{
                this.clearActive()
            })
        },
        active(){
            $(this.view.el).addClass('active')
        },
        clearActive(){
            $(this.view.el).removeClass('active')
        }
    }
    controller.init(view, model)
    //命名空间实现模块数据交互
    // window.app.newSong = controller
}
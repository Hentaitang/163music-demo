{
    let view = {
        el: '.newSong',
        template: `
        <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-jia"></use>
        </svg>
        <span>新建歌曲</span>
        `,
        render(data){
            $(this.el).html(this.template)
        },
        active(){
            $(this.el).addClass('active')
        },
        clearActive(){
            $(this.el).removeClass('active')
        }
    }
    let model = {}
    let controller = {
        init(view, model){
            this.view = view
            this.model = model
            this.view.render(this.model.data)
            this.view.active()
            window.eventHub.on('new', (data)=>{
                this.view.active()
            })
            window.eventHub.on('create', (data)=>{
                $(this.view.el).trigger('click')
            })
            window.eventHub.on('select', (data)=>{
                this.view.clearActive()
            })
            $(this.view.el).on('click', ()=>{
                window.eventHub.emit('new')
            })
        }
    }
    controller.init(view, model)
    //命名空间实现模块数据交互
    // window.app.newSong = controller
}
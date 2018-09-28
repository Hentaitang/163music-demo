{
    let view = {
        el: '#topBar',
        template: `
        <ul class="tabs">
            <li class="active">
                <div>
                    推荐音乐
                </div>
            </li>
            <li>
                <div>
                    热歌榜
                </div>
            </li>
            <li>
                <div>
                    搜索
                </div>
            </li>
        </ul>
        `,
        render(){
            $(this.el).append(this.template)
        },
        active(el){
            $(el).addClass('active').siblings().removeClass('active')
        }
    }
    let model = {}
    let controller = {
        init(view, model){
            this.view = view
            this.model = model
            this.view.render()
            this.bindEvent()
        },
        bindEvent(){
            $(this.view.el).on('click', 'li', (e)=>{
                this.view.active(e.currentTarget)
            })
        }
    }
    controller.init(view, model)
}
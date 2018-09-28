{
    let view = {
        el: '#recommend > #newSong',
        template: `
            <li>
                <div class="song">
                    <div class="name">
                        一江水 (超级剧集《天坑鹰猎》概念主题曲)
                    </div>
                    <p>毛不易</p>
                </div>
                <div class="play"></div>
            </li>
        `,
        render(data){
            $(this.el).html(this.template)
        }
    }
    let model = {}
    let controller = {
        init(view, model){
            this.view = view
            this.model = model
            this.view.render()
        }
    }
    controller.init(view, model)
}
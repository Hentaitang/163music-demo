{
    let view = {
        el: '.page > main',
        template: `
        <h1>新建歌曲</h1>
        <form class="form">
            <div class="row">
                <label for="songName">歌名</label>
                <input type="text" id="songName" value="__key__">
            </div>
            <div class="row">
                <label for="singer">歌手</label>
                <input type="text" id="singer">
            </div>
            <div class="row">
                <label for="url">链接</label>
                <input type="text" id="url" value="__link__">
            </div>
            <div class="row active">
                <input type="submit" value="保存">
            </div>
        </form>
        `,
        render(data = {}){
            let placeholders = ['key', 'link']
            let html = this.template
            placeholders.map((string)=>{
                html = html.replace(`__${string}__`, data[string] || '')
            })
            $(this.el).html(html)
        }
    }
    let model = {}
    let controller = {
        init(view, model){
            this.view = view
            this.model = model
            this.view.render(this.model.data)
            window.eventHub.on('upload', (data)=>{
                this.view.render(data)
            })
        }
        // reset(data){
        //     $('#songName').val(data.key)
        //     $('#url').val(data.link)
        // }
    }
    controller.init(view, model)
    //命名空间实现模块数据交互
    // window.app.songForm = controller
}
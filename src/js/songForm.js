{
    let view = {
        el: '.page > main',
        template: `
        <h1>新建歌曲</h1>
        <form class="form">
            <div class="row">
                <label for="songName">歌名</label>
                <input type="text" id="songName">
            </div>
            <div class="row">
                <label for="singer">歌手</label>
                <input type="text" id="singer">
            </div>
            <div class="row">
                <label for="url">链接</label>
                <input type="text" id="url">
            </div>
            <div class="row active">
                <input type="submit" value="保存">
            </div>
        </form>
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
            this.view.render(this.model.data)
        }
    }
    controller.init(view, model)
}
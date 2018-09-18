{
    let view = {
        el: '.songList-container',
        template: `
        <ul class="songList">
            <li><div>歌曲1</div></li>
            <li><div>歌曲2</div></li>
            <li class="pre-active"><div>歌曲3</div></li>
            <li class="active"><div>歌曲4</div></li>
            <li><div>歌曲5</div></li>
            <li><div>歌曲6</div></li>
            <li><div>歌曲7</div></li>
            <li><div>歌曲8</div></li>
            <li><div>歌曲9</div></li>
            <li><div>歌曲10</div></li>
        </ul>
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
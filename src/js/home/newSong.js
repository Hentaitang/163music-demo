{
    let view = {
        el: '#recommend > #newSong',
        template: `
            <li>
                <div class="song">
                    <div class="name">
                       {{songName}}
                    </div>
                    <p>{{singer}}</p>
                </div>
                <div class="play"></div>
            </li>
        `,
        render(data) {
            data.map((song) => {
                let $li = $(this.template.replace('{{songName}}', song.name)
                    .replace('{{singer}}', song.singer))
                $(this.el).append($li)
            })
        }
    }
    let model = {
        data: [],
        getSong() {
            let query = new AV.Query('Song')
            var now = new Date();
            query.descending('createdAt');
            query.lessThanOrEqualTo('createdAt', now);//查询今天之前创建的 Todo
            query.limit(10);// 最多返回 10 条结果
            let hash
            return query.find().then((songs) => {
                songs.map((song) => {
                    hash = { id: song.id, ...song.attributes }
                    this.data.push(hash)
                })
            })
            
        }
    }
    let controller = {
        init(view, model) {
            this.view = view
            this.model = model
            this.model.getSong().then(() => {
                this.view.render(this.model.data)
            })
        }
    }
    controller.init(view, model)
}
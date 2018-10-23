{
    let view = {
        el: '#hotSong  #newSong',
        template: `
            <a href="./song.html?id={{songId}}">
                <div class="number">{{number}}</div>
                <div class="mianMessage">
                    <div class="song">
                        <div class="name">
                        {{songName}}
                        </div>
                        <p>
                            <span></span>
                            {{singer}}
                        </p>
                    </div>
                    <div class="play"></div>
                </div>
            </a>
        `,
        render(data) {
            for(let i=0; i<data.length; i++){
                let $li = $(this.template.replace('{{songName}}', data[i].name)
                    .replace('{{songId}}', data[i].id)
                    .replace('{{number}}', i+1<10? `0${i+1}`: 10)
                    .replace('{{singer}}', data[i].singer)).addClass(data[i].id)
                $(this.el).append($li)
            }
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
                    hash = Object.assign({id: song.id}, song.attributes)
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
            this.bindEvent()
        },
        bindEvent(){
            $(this.view.el).on('click', 'li', (e)=>{
                let id = $(e.currentTarget).attr('class')
                window.location.hash = id
            })
        }
    }
    controller.init(view, model)
}
{
    let view = {
        el: '.page > main',
        template: `
        <form class="form">
            <div class="row">
                <label for="songName">歌名</label>
                <input name="name" type="text" id="songName" value="__name__">
            </div>
            <div class="row">
                <label for="singer">歌手</label>
                <input name="singer" type="text" id="singer" value="__singer__">
            </div>
            <div class="row">
                <label for="url">链接</label>
                <input name="url" type="text" id="url" value="__url__">
            </div>
            <div class="row active">
                <input type="submit" value="保存">
            </div>
        </form>
        `,
        render(data = {}) {
            let placeholders = ['name', 'singer', 'url', 'id']
            let html = this.template
            placeholders.map((string) => {
                html = html.replace(`__${string}__`, data[string] || '')
            })
            $(this.el).html(html)
            if(!data.id){
                $(this.el).prepend('<h1>新建歌曲</h1>')
            }else{
                $(this.el).prepend('<h1>编辑歌曲</h1>')
            }
        },
        reset() {
            this.render({})
        }
    }
    let model = {
        data: { name: '', singer: '', url: '', id: '' },
        create(data) {
            var Song = AV.Object.extend('Song');
            var song = new Song();
            song.set('name', data.name);
            song.set('singer', data.singer);
            song.set('url', data.url);
            return song.save().then((newSong) => {
                let { id, attributes } = newSong
                Object.assign(this.data, { id, ...attributes })
            }, (error) => {
                console.error(error);
            });
        },
        update(data) {
            data.id = this.data.id
            var song = AV.Object.createWithoutData('Song', data.id);
            song.set('name', data.name);
            song.set('singer', data.singer);
            song.set('url', data.url);
            return song.save().then((newSong) => {
                let {id, attributes} = newSong
                Object.assign(this.data, {id, ...attributes})
            })
        }
    }
    let controller = {
        init(view, model) {
            this.view = view
            this.model = model
            this.bindEvent()
            this.view.render(this.model.data)
            window.eventHub.on('select', (data) => {
                Object.assign(this.model.data, data)
                this.view.render(this.model.data)
            })
            window.eventHub.on('new', (data) => {
                this.model.data = {}
                if(!data){
                    this.view.render(this.model.data)
                }else{
                    this.view.render(data)
                }
                
            })
        },
        bindEvent() {
            $(this.view.el).on('submit', 'form', (e) => {
                e.preventDefault()
                let data = {}
                let needs = 'name singer url'.split(' ')
                needs.map((string) => {
                    data[string] = $(this.view.el).find(`[name="${string}"]`).val()
                })
                if (!this.model.data.id) {
                    this.model.create(data).then(() => {
                        this.view.reset()
                        window.eventHub.emit('create', JSON.parse(JSON.stringify(this.model.data)))
                    })
                } else {
                    this.model.update(data).then(() => {
                        window.eventHub.emit('update', JSON.parse(JSON.stringify(this.model.data)))
                    })
                }
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
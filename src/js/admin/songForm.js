{
    let view = {
        el: '.page > main  .wrapper',
        template: `
            <form class="form">
                <div class="row">
                    <label for="songName">歌名：</label>
                    <input name="name" type="text" id="songName" value="__name__">
                </div>
                <div class="row">
                    <label for="singer">歌手：</label>
                    <input name="singer" type="text" id="singer" value="__singer__">
                </div>
                <div class="row">
                    <label for="url">链接：</label>
                    <input name="url" type="text" id="url" value="__url__">
                </div>
                <div class="row">
                    <label for="cover">封面：</label>
                    <input name="cover" type="text" id="cover" value="__cover__">
                </div>
                <div class="row">
                    <label for="lyrics">歌词：</label>
                    <textarea name="lyrics" id="lyrics">__lyrics__</textarea>
                </div>
                <div class="row active">
                    <input type="submit" value="保存">
                </div>
            </form>
        `,
        render(data = {}) {
            let placeholders = ['name', 'singer', 'url', 'id', 'cover', 'lyrics']
            let html = this.template
            placeholders.map((string) => {
                html = html.replace(`__${string}__`, data[string] || '')
            })
            $(this.el).html(html)
            if (!data.id) {
                $(this.el).siblings('.upload').addClass('show').siblings('.show').removeClass('show')
            } else {
                $(this.el).addClass('show').siblings('.show').removeClass('show')
                $(this.el).prepend('<p>编辑歌曲信息</p>')
            }
        },
        reset(data) {
            this.render(data)
            $(this.el).addClass('show').siblings('.show').removeClass('show')
            $(this.el).prepend('<p>上传成功！请编辑歌曲信息！</p>')
        }
    }
    let model = {
        data: { name: '', singer: '', url: '', id: '' , cover: '', lyrics: ''},
        create(data) {
            var Song = AV.Object.extend('Song');
            var song = new Song();
            song.set('name', data.name);
            song.set('singer', data.singer);
            song.set('url', data.url);
            song.set('cover', data.cover);
            song.set('lyrics', data.lyrics);
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
            song.set('cover', data.cover);
            song.set('lyrics', data.lyrics);
            return song.save().then((newSong) => {
                let { id, attributes } = newSong
                Object.assign(this.data, { id, ...attributes })
            })
        }
    }
    let controller = {
        init(view, model) {
            this.view = view
            this.model = model
            this.view.render(this.model.data)
            this.bindEvent()
            window.eventHub.on('select', (data) => {
                Object.assign(this.model.data, data)
                this.view.render(this.model.data)
            })
            window.eventHub.on('new', (data) => {
                this.model.data = {}
                if(!data){
                    this.view.render(this.model.data)
                }else{
                    this.view.reset(data)
                }
            })
        },
        bindEvent() {
            $(this.view.el).on('submit', 'form', (e) => {
                e.preventDefault()
                let data = {}
                let needs = 'name singer url cover lyrics'.split(' ')
                needs.map((string) => {
                    data[string] = $(this.view.el).find(`[name="${string}"]`).val()
                })
                if (data.name) {
                    if (!this.model.data.id) {
                        this.model.create(data).then(() => {
                            window.eventHub.emit('create', JSON.parse(JSON.stringify(this.model.data)))
                        })
                    } else {
                        this.model.update(data).then(() => {
                            window.eventHub.emit('update', JSON.parse(JSON.stringify(this.model.data)))
                        })
                    }
                } else {
                    alert('请输入歌曲信息')
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
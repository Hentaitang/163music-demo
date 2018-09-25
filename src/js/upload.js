{
    let view = {
        el: '.upload',
        template: `
        <div id="container">
            <div id="pickfiles">
                <img src="./img/duoduo.png">
                <span>点击上传音乐</span>
                <p>拖拽音乐到此处也可上传</p>
            </div>
        </div>
        <div class="progress">
            <p>上传中...</p>
            <div class="progressBar">
                <div class="inside"></div>
            </div>
            <span>0%</span>
        </div>
        `,
        render(data) {
            $(this.el).html(this.template)
            $(this.el).find('#container').show().siblings('.progress').hide()
            // $(this.el).find('#container').hide().siblings('.progress').show()
        },
        hide(data){
            $(this.el).find('#container').hide().siblings('.progress').show()
            $(this.el).find('.progress > span').text(`${data}%`)
        },
        show(){
            $(this.el).find('#container').show().siblings('.progress').hide()
        }
    }
    let model = {}
    let controller = {
        init(view, model) {
            this.view = view
            this.model = model
            this.view.render(this.model.data)
            this.Qiniu()
        },
        Qiniu() {
            var uploader = Qiniu.uploader({
                runtimes: 'html5',      // 上传模式,依次退化
                browse_button: 'pickfiles',         // 上传选择的点选按钮，**必需**
                uptoken_url: 'http://localhost:8888/uptoken',         // Ajax 请求 uptoken 的 Url，**强烈建议设置**（服务端提供）
                get_new_uptoken: false,             // 设置上传文件的时候是否每次都重新获取新的 uptoken
                domain: 'http://pf8otoovm.bkt.clouddn.com',     // bucket 域名，下载资源时用到，如：'http://xxx.bkt.clouddn.com/' **必需**
                container: 'container',             // 上传区域 DOM ID，默认是 browser_button 的父元素，
                max_file_size: '40mb',             // 最大文件体积限制
                max_retries: 3,                     // 上传失败最大重试次数
                dragdrop: true,                     // 开启可拖曳上传
                drop_element: 'container',          // 拖曳上传区域元素的 ID，拖曳文件或文件夹后可触发上传
                chunk_size: '4mb',                  // 分块上传时，每块的体积
                auto_start: true,                   // 选择文件后自动上传，若关闭需要自己绑定事件触发上传,
                init: {
                    'FilesAdded': (up, files)=>{
                        plupload.each(files, function (file){
                            // 文件添加进队列后,处理相关的事情
                        });
                    },
                    'BeforeUpload': (up, file)=>{
                        $(this.view.el).find('.inside').css('transform', 'translate(-100%)')
                    },
                    'UploadProgress': (up, file)=>{
                        let progress = file.percent
                        this.view.hide(progress)
                        $(this.view.el).find('.inside').css("transform", `translate(-${100 - progress}%)`)
                    },
                    'FileUploaded': (up, file, info)=>{
                        this.view.show()
                        var domain = up.getOption('domain');
                        var response = JSON.parse(info.response);
                        var sourceLink = domain + '/' + encodeURIComponent(response.key);
                        window.eventHub.emit('new', { url: sourceLink, name: response.key })
                        //命名空间实现模块数据交互
                        // window.app.newSong.active()
                        // window.app.songForm.reset({link: sourceLink, key: response.key})
                    },
                    'Error': (up, err, errTip)=>{
                        //上传出错时,处理相关的事情
                    },
                    'UploadComplete': ()=>{
                        //队列文件处理完毕后,处理相关的事情
                    }
                }
            })
        }
    }
    controller.init(view, model)
}
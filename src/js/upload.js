{
    let view = {
        el: '.upload',
        template: `
        <div id="container">
            <div id="pickfiles">
                <span>点击或拖拽文件</span>
                <p>文件大小不能超过 40MB</p>
            </div>
        </div>
        `,
        render(data) {
            $(this.el).html(this.template)
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
                    'FilesAdded': function (up, files) {
                        plupload.each(files, function (file) {
                            // 文件添加进队列后,处理相关的事情
                        });
                    },
                    'BeforeUpload': function (up, file) {
                        // 每个文件上传前,处理相关的事情
                    },
                    'UploadProgress': function (up, file) {
                        // 每个文件上传时,处理相关的事情

                    },
                    'FileUploaded': function (up, file, info) {
                        var domain = up.getOption('domain');
                        var response = JSON.parse(info.response);
                        var sourceLink = domain + '/' + encodeURIComponent(response.key);
                        window.eventHub.emit('upload', {url: sourceLink, name: response.key})
                        //命名空间实现模块数据交互
                        // window.app.newSong.active()
                        // window.app.songForm.reset({link: sourceLink, key: response.key})
                    },
                    'Error': function (up, err, errTip) {
                        //上传出错时,处理相关的事情
                    },
                    'UploadComplete': function () {
                        //队列文件处理完毕后,处理相关的事情
                    }
                }
            })
        }
    }
    controller.init(view, model)

}
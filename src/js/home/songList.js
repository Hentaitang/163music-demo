{
    let view = {
        el: '#recommend > #songList',
        template: `
            <ul class="clearfix">
                <li>
                    <img src="./img/1.webp">
                    <p>再见臧天朔，一路走好。</p>
                </li>
                <li>
                    <img src="./img/2.webp">
                    <p>【日系恋爱】其实从很久以前，我就很喜欢你</p>
                </li>
                <li>
                    <img src="./img/3.webp">
                    <p>【女声控】天籁之音，声线美到窒息「六」</p>
                </li>
            </ul>
            <ul class="clearfix">
                <li>
                    <img src="./img/4.webp">
                    <p>〖日系〗愿你一生温柔相许~</p>
                </li>
                <li>
                    <img src="./img/5.webp">
                    <p>ฅ 可爱进行时 ฅ 将卖萌进行到底 ฅ</p>
                </li>
                <li>
                    <img src="./img/6.webp">
                    <p>歌词唱透了心声，回忆模糊了眼眸</p>
                </li>
            </ul>
        `,
        render(){
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
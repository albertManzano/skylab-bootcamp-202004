class News2 extends Component {
    constructor () {
        super(`<section class="news-grid2">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        </section>`)
        const section = this.container.querySelectorAll('div')
        newsVandal(function(results){
            for (var i = 0; i < 6; i++){
                const temp = document.createElement('div')
                temp.innerHTML = `<a href="${results[i].link}" target="_blank"><h1>${results[i].textTitle}</h1></a>`
                const names = temp.firstChild
                section[i].append(names)
            }
        })

        document.getElementById('root').appendChild(this.container)
    }
}
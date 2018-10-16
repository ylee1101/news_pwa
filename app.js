const apiKey = "1b5667a7b2d3494b9634e9eb9f30eb3b";
const main = document.querySelector('main');
const sourceSelector = document.querySelector('#sourceSelector')
const defaultSource = 'the-washington-post'

// navigator object
window.addEventListener('load', async e => {
    updateNews();
    await updateSources();
    sourceSelector.value = defaultSource;

    sourceSelector.addEventListener('change', e => {
        updateNews(e.target.value);
    })

    if ('serviceWorker' in navigator) {
        try {
            navigator.serviceWorker.register('sw.js'); //only works in the same folder
            console.log("sw registered")
        } catch (error) {
            console.log("sw failed");
        }
    }
})

async function updateSources() {
    // let res = await fetch(`https://newsapi.org/v2/sources?apiKey=${apiKey}`)
    const res = await fetch(`https://newsapi.org/v1/sources`)
    const json = await res.json()
    // console.log("11",json)
    sourceSelector.innerHTML = json.sources.map(src => `<option value="${src.id}>"${src.name}</option>`).join('\n')
    // console.log("22", sourceSelector.innerHTML)
}

async function updateNews(source = defaultSource) {
    const res = await fetch(`https://newsapi.org/v2/top-headlines?sources=${source}&sortBy=top&apiKey=${apiKey}` )
    const json = await res.json();
    main.innerHTML = json.articles.map(createArticle).join('\n');
} 

function createArticle(article) {
    // console.log("article", article)
    return `
        <div class="article">
            <a href="${article.url}">
                <h2>${article.title}</h2>
                <img src="${article.urlToImage}"}>
                <p>${article.description}</p>
            </a>
        </div>
        `;
    
}
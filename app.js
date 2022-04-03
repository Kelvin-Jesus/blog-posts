const postsContainer = document.querySelector('#posts-container')
const loaderContainer = document.querySelector('.loader')
const filterInput = document.querySelector('.filter')

let timer;
let page = 1;

const getPosts = async () => {
    const response = await fetch(`https://jsonplaceholder.typicode.com/posts?_limit=5&_page=${page}`);
    return await response.json();
}

const generatePostsTemplate = posts => posts.map(({ id, title, body }) => `
    <article class="post">
        <div class="number">${id}</div>
        <div class="post-info">
            <h2 class="post-title">${title}</h2>
            <p class="post-body">${body}</p>
        </div>
    </article>
`).join('')

const addPostsIntoDOM = async () => {
    const posts = await getPosts()
    const postsTemplate = generatePostsTemplate(posts)
    postsContainer.innerHTML += postsTemplate
}

const getNextPosts = () => {
    setTimeout(() => {
        page++
        addPostsIntoDOM()
    }, 300)
}

const removeLoader = () => {
    setTimeout(()=>{
        loaderContainer.classList.remove('show')
        getNextPosts()
    }, 1000)
}

const showLoader = () => {
    loaderContainer.classList.add('show')
    removeLoader()
}

const debounce = cllbck => {
    if ( timer ) {
        clearTimeout(timer);
    }
    timer = setTimeout(() => {
        cllbck();
        timer = null
    }, 200);
    return;
}

const handleScrollToPageBottom = () => {
    const {clientHeight, scrollTop, scrollHeight} = document.documentElement
    
    let isPageAlmostInFooter = scrollTop + clientHeight >= scrollHeight - 80
    if ( isPageAlmostInFooter ) showLoader()
}

const showPostIfMatchesInputValue = inputValue => post => {
    
    const postTitle = post.querySelector('.post-title').textContent.toLowerCase()
    const postBody = post.querySelector('.post-body').textContent.toLowerCase()

    const postDataConstainsInputValue = postTitle.includes(inputValue) || postTitle.includes(inputValue);

    if ( postDataConstainsInputValue ) {
        post.style.display = 'flex';
        return;
    }
    
    else {
        post.style.display = 'none'
    }

}

const handleInputValue = e => {
    
    const inputValue = e.target.value.toLowerCase()
    const posts = document.querySelectorAll('.post')

    // Closure
    posts.forEach(showPostIfMatchesInputValue(inputValue))

}

addPostsIntoDOM()

window.addEventListener('scroll', () => debounce(handleScrollToPageBottom))
filterInput.addEventListener('input', handleInputValue)
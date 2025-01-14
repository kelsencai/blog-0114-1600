document.addEventListener('DOMContentLoaded', () => {
    const content = document.getElementById('content');
    const comments = document.getElementById('comments');

    let articles = []; // 用于存储从 articles.json 加载的文章数据

    // 从 articles.json 加载数据
    fetch('articles.json')
        .then(response => response.json())
        .then(data => {
            articles = data;
            const hash = window.location.hash;
            if (hash.startsWith('#article-')) {
                const id = parseInt(hash.replace('#article-', ''), 10);
                loadArticle(id);
            } else {
                loadArticleList();
            }
        })
        .catch(error => {
            console.error('加载文章数据失败:', error);
            content.innerHTML = '<p>无法加载文章数据，请稍后重试。</p>';
        });

    // 加载文章列表
    function loadArticleList() {
        content.innerHTML = articles.map(article => `
            <div class="article">
                <h2><a href="#article-${article.id}">${article.title}</a></h2>
                <small>${article.date}</small>
            </div>
        `).join('');
    }

    // 加载文章内容
    function loadArticle(id) {
        const article = articles.find(a => a.id === id);
        if (article) {
            content.innerHTML = `
                <h1>${article.title}</h1>
                <small>${article.date}</small>
                <p>${article.content}</p>
                <a href="/">返回首页</a>
            `;
            loadComments(article.comments);
        } else {
            content.innerHTML = '<p>文章未找到。</p>';
        }
    }

    // 加载评论
    function loadComments(commentList) {
        comments.innerHTML = `
            <h3>评论</h3>
            <div id="comment-list">
                ${commentList.length > 0 ? commentList.map(comment => `
                    <div class="comment">
                        <strong>${comment.author}</strong>
                        <p>${comment.text}</p>
                    </div>
                `).join('') : '<p>暂无评论。</p>'}
            </div>
            <form id="comment-form">
                <input type="text" id="comment-author" placeholder="你的名字" required>
                <textarea id="comment-text" placeholder="输入你的评论" required></textarea>
                <button type="submit">提交评论</button>
            </form>
        `;

        // 提交评论
        document.getElementById('comment-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const author = document.getElementById('comment-author').value;
            const text = document.getElementById('comment-text').value;

            if (author && text) {
                const newComment = { author, text };
                commentList.push(newComment);
                loadComments(commentList);
                document.getElementById('comment-form').reset();
            }
        });
    }

    // 监听 URL 变化（用于返回首页后重新加载文章列表）
    window.addEventListener('hashchange', () => {
        const hash = window.location.hash;
        if (hash.startsWith('#article-')) {
            const id = parseInt(hash.replace('#article-', ''), 10);
            loadArticle(id);
        } else {
            loadArticleList();
        }
    });
});
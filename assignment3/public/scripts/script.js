
async function createBlog() {
    await fetch('/blogs', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            title: document.getElementById('title-inp').value,
            body: document.getElementById('body-inp').value,
            author: document.getElementById('author-inp').value
        })
    });
    location.reload();
}

async function updateBlog(id) {
    await fetch(`/blogs/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            title: document.getElementById('title-inp').value,
            body: document.getElementById('body-inp').value,
            author: document.getElementById('author-inp').value
        })
    });
    location.reload();
}

async function deleteBlog(id) {
    await fetch(`/blogs/${id}`, {
        method: 'DELETE'
    });
    location.reload();
}

async function fetchBlogs() {
    try {
        const response = await (await fetch('/blogs')).json();
        console.log(response.length);

        const blogs = document.querySelector('.blogs');

        response.forEach(blog => {
            console.log(blog);

            const blogHtml = `
                <div class="card">
                    <h2 class="title">${blog.title}</h2>
                    
                    <p class="body" style="font-size: 18px;">${blog.body}</p>
                    <div class="metadata">
                        <p class="author">Author: ${blog.author}</p>
                        <p class="created-at">Created at: ${new Date(blog.createdAt).toLocaleString(undefined, { hour12: false })}</p>
                        <p class="updated-at">Updated at: ${new Date(blog.updatedAt).toLocaleString(undefined, { hour12: false })}</p>
                    </div>
                    <button class="edit-btn" onclick="updateBlog('${blog._id}')">Edit</button>
                    <button class="delete-btn" onclick="deleteBlog('${blog._id}')">Delete</button>
                </div>
            `;
            blogs.innerHTML += blogHtml;
    });
    } catch (error) {
        console.error(error);
    }
}

fetchBlogs();
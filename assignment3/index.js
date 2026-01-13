const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static('public'));

mongoose.connect('mongodb://localhost:27017/blog')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err))

const schema = new mongoose.Schema({
        title: { type: String, required: true },
        body: { type: String, required: true },
        author: { type: String, default: 'Anonymous' },
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now }
    });
const Blog = mongoose.model('Blog', schema);

app.get('/blogs', async (req, res) => {
    res.send(await Blog.find());
})

app.post('/blogs', async (req, res) => {
    if (!req.body.title || !req.body.body) {
        return res.status(400).send({ message: 'Title and body are required' });
    }
    if (req.body.author === '') {
        req.body.author = 'Anonymous';
    }
    const newBlog = new Blog({
        title: req.body.title,
        body: req.body.body,
        author: req.body.author
    });
    await newBlog.save(); 
    res.send(newBlog);
})

app.get('/blogs/:id', async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).send({ message: 'Invalid blog ID' });
    }
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
        return res.status(404).send({ message: 'Blog not found' });
    }
    res.status(200).send( blog );
})

app.put('/blogs/:id', async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).send({ message: 'Invalid blog ID' });
    }
    if (req.body.title == '') {
        req.body.title = undefined;
    }
    if (req.body.body == '') {
        req.body.body = undefined;
    }
    if (req.body.author === '') {
        req.body.author = 'Anonymous';
    }

    console.log(req.body.body);
    
    const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, {
        title: req.body.title,
        body: req.body.body,
        author: req.body.author,
        updatedAt: Date.now()
    }, { new: true });
    if (!updatedBlog) {
        return res.status(404).send({ message: 'Blog not found' });
    }
    await updatedBlog.save();
    res.status(200).send(updatedBlog);
})

app.delete('/blogs/:id', async (req, res) => {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) {
        return res.status(404).send({ message: 'Blog not found' });
    }
    res.status(200).send({ message: `Blog ${req.params.id} deleted` });
})

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
});
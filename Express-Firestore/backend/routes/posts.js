const express = require("express");
const router = express.Router();
const db = require("../firebase")
const { getDocs, getDoc, collection, orderBy, query, doc, addDoc, updateDoc, deleteDoc } = require("firebase/firestore")

// GET all posts from firestore
router.get("/", async(req, res) => {
    try {
        const postsQuery = query(
            collection(db, 'posts'),
            orderBy('createdAt')
        );

        const postsSnapshot = await getDocs(postsQuery)

        const posts = [];
        postsSnapshot.forEach(doc => {
            posts.push({
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt?.toDate?.() || new Date()
            });
        });
        res.json(posts);
    }
    catch (e){
        console.error('Error getting posts:', e)
        res.status(500).json({ error: 'Failed to fetch posts'});
    }    
});

//GET all posts from last period

//POST a new post

router.post("/", async(req, res) => {
    try{
        const { username, message } = req.body;
        if(!username || !message) {
            return res.status(400).json({ error: 'Username and message are required' });
        };
        
        const newPost = {
            username: username.trim(),
            message: message.trim(),
            createdAt: new Date(),
            updatedAt: new Date()
        }

        const addPost = await addDoc(collection(db, 'posts'), newPost);
        res.status(201).json({
            id: addPost.id,
            ...newPost
        })
    }
    catch(e){
        console.log("Error posting:", e);
        res.status(500).json({ error: 'Failed to post'});
    };
});

//PUT an updated post
router.put('/:id', async(req, res) => {
    try{
        const { id } = req.params;
        const { username, message } = req.body;

        if (!username || !message) {
            return res.status(400).json({ error: 'Username and message are required' });
        };

        const updateData = {
            username: username.trim(),
            message: message.trim(),
            updatedAt: new Date()
        };
        const postRef = doc(db, 'posts', id);
        await updateDoc(postRef, updateData);
        const updatedPost = await getDoc(postRef);

        if(!updatedPost.exists){
            return res.status(404).json({ error: 'Post not found' });

        };

        res.json({
            id: updatedPost.id,
            ...updatedPost.data(),
            createdAt: updatedPost.data().createdAt?.toDate?.() || new Date(),
            updatedAt: updatedPost.data().updatedAt?.toDate?.() || new Date()
          });
    }
    catch(e){
        console.log("Error updating post:", e);
        res.status(500).json({ error: 'Failed to update post'});
    }
});

//DETETE a specific post
router.delete('/:id', async (req, res) => {
    try{
        const { id } = req.params;
        const postRef = doc(db, 'posts', id);
        const post = await getDoc(postRef);
        if (!post.exists()) {
            return res.status(404).json({ error: 'Post not found' });
        }
        await deleteDoc(postRef);
        res.json({ message: 'Post deleted successfully!' });
    }
    catch(e){
        console.log("Error deleting post:", e);
        res.status(500).json({ error: 'Failed to delete post'});
    }
});

module.exports = router;
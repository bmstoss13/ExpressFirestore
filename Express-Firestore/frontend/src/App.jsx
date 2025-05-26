import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MessageForm from './components/messageForm';
import MessageList from './components/messageList';
import './App.css';

function App(){
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  
  const fetchPosts = async() => {

    try{
      setLoading(true);
      const response = await axios.get('http://localhost:3000/posts')
      setPosts(response.data);
      setError(null);
    }
    catch(e){
      console.error('Error fetching posts:', e)
      setError('Failed to fetch posts.');
    }
    finally{
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchPosts();
  }, [filter]);

  const handleNewPost = async (postData) => {
    try {
      const response = await axios.post('http://localhost:3000/posts', postData);
      const newPost = response.data;
      setPosts((prevPosts) => [newPost, ...prevPosts]);
      return true;
    } 
    catch (e) {
      console.error('Error creating post:', e);
      setError('Failed to create post.');
      return false;
    }
  };

  const handleUpdatePost = async (id, postData) => {
    try {
      const response = await axios.put(`http://localhost:3000/posts/${id}`, postData);
      const updatedPost = response.data;
      setPosts((prevPosts) =>
        prevPosts.map((post) => (post.id === id ? updatedPost : post))
      );
      return true;
    } 
    catch (e) {
      console.error('Error updating post:', e);
      setError('Failed to update post.');
      return false;
    }
  };
  const handleDeletePost = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/posts/${id}`);
      setPosts((prevPosts) => prevPosts.filter((post) => post.id !== id));
      return true;
    } 
    catch (e) {
      console.error('Error deleting post:', e);
      setError('Failed to delete post.');
      return false;
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Message Board</h1>
        <p>Share your thoughts with the world!</p>
      </header>

      <main className="App-main">
        <MessageForm onSubmit={handleNewPost} />
        
        <div className="filter-section">
          <label htmlFor="filter-select">Show posts from: </label>
          <select 
            id="filter-select"
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All time</option>
            <option value="hour">Last hour</option>
            <option value="day">Last day</option>
            <option value="week">Last week</option>
          </select>
          <button onClick={fetchPosts} className="refresh-btn">
            Refresh
          </button>
        </div>

        {error && (
          <div className="error-message">
            Error: {error}
          </div>
        )}

        {loading ? (
          <div className="loading">Loading posts...</div>
        ) : (
          <MessageList 
            posts={posts}
            onUpdate={handleUpdatePost}
            onDelete={handleDeletePost}
          />
        )}
      </main>
    </div>
  );
}

export default App;
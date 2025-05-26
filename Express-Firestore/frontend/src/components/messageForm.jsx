import React, { useState } from 'react';

function MessageForm({ onSubmit }) {
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!username.trim() || !message.trim()) {
      alert('Please fill in both username and message');
      return;
    }

    setIsSubmitting(true);
    
    const success = await onSubmit({
      username: username.trim(),
      message: message.trim()
    });

    if (success) {
      setUsername('');
      setMessage('');
    }
    
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit}part>
      <h1>Post a Message</h1>
      <div>
        <label htmlFor="username"> Username:</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter your username"
          maxLength={50}
          disabled={isSubmitting}
        />
      </div>
      <div>
        <label htmlFor="message">Message:</label>
        <textarea
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="What's on your mind?"
          rows={4}
          maxLength={500}
          disabled={isSubmitting}
        />
        <small className="char-count">
          {message.length}/500 characters
        </small>

      </div>
      <button 
          type="submit" 
          disabled={isSubmitting || !username.trim() || !message.trim()}
        >
          {isSubmitting ? 'Posting...' : 'Post Message'}
      </button>
    </form>
  );
}

export default MessageForm;

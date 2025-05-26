import React from 'react';
import MessageItem from './messageItem.jsx';

function MessageList({ posts, onUpdate, onDelete }) {
  if (posts.length === 0) {
    return (
      <div className="no-posts">
        <p>No messages yet. Be the first to post!</p>
      </div>
    );
  }

  return (
    <div>
      <h2>Messages ({posts.length})</h2>
      {posts.map(post => (
        <MessageItem
          key={post.id}
          post={post}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

export default MessageList;
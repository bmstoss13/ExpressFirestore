import React, { useState } from 'react';

function MessageItem({ post, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editUsername, setEditUsername] = useState(post.username);
  const [editMessage, setEditMessage] = useState(post.message);
  const [isLoading, setIsLoading] = useState(false);

  const handleEdit = () => {
    setIsEditing(true);
    setEditUsername(post.username);
    setEditMessage(post.message);
  };

  const handleSave = async () => {
    if (!editUsername.trim() || !editMessage.trim()) {
      alert('Please fill in both username and message');
      return;
    }

    setIsLoading(true);
    const success = await onUpdate(post.id, {
      username: editUsername.trim(),
      message: editMessage.trim()
    });

    if (success) {
      setIsEditing(false);
    }
    setIsLoading(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditUsername(post.username);
    setEditMessage(post.message);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      setIsLoading(true);
      await onDelete(post.id);
      setIsLoading(false);
    }
  };

  const formatDate = (date) => {
    const d = new Date(date);
    return d.toLocaleString();
  };

  return (
    <div>
      {isEditing ? (
        <div>
          <input
            type="text"
            value={editUsername}
            onChange={(e) => setEditUsername(e.target.value)}
            placeholder="Username"
            maxLength={50}
            disabled={isLoading}
          />
          <textarea
            value={editMessage}
            onChange={(e) => setEditMessage(e.target.value)}
            placeholder="Message"
            rows={3}
            maxLength={500}
            disabled={isLoading}
          />
          <div>
            <button 
              onClick={handleSave} 
              disabled={isLoading}
              className="save-btn"
            >
              {isLoading ? 'Saving...' : 'Save'}
            </button>
            <button 
              onClick={handleCancel} 
              disabled={isLoading}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <div>
            <strong>{post.username}</strong>
            <span>
              {formatDate(post.createdAt)}
              {post.updatedAt && post.updatedAt !== post.createdAt && (
                <em> (edited)</em>
              )}
            </span>
          </div>
          <div>
            {post.message}
          </div>
          <div>
            <button 
              onClick={handleEdit} 
              disabled={isLoading}
            >
              Edit
            </button>
            <button 
              onClick={handleDelete} 
              disabled={isLoading}
            >
              {isLoading ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default MessageItem;
// import React from 'react';

// const UserCard = ({ user, isSelected, onSelect }) => {
//   return (
//     <div className={`user-card ${isSelected ? 'selected' : ''}`}>
//       <div className="selection">
//         <input 
//           type="checkbox"
//           checked={isSelected}
//           onChange={() => onSelect(user.id)}
//         />
//       </div>
//       <img 
//         src={user.avatar} 
//         alt={user.name} 
//         className="avatar"
//         onError={(e) => e.target.src = 'https://via.placeholder.com/150'} 
//       />
//       <div className="user-info">
//         <h3>{user.name}</h3>
//         <p>{user.email}</p>
//       </div>
//     </div>
//   );
// };

// export default UserCard;


import React, { useState } from 'react';

const UserCard = ({ user, isSelected, onSelect }) => {
  const [imgError, setImgError] = useState(false);
  
  const handleImageError = () => {
    setImgError(true);
  };

  const handleKeyDown = (e) => {
    // فعال‌سازی با کلید Space یا Enter
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      onSelect(user.id);
    }
  };

  return (
    <div 
      className={`user-card ${isSelected ? 'selected' : ''}`}
      role="listitem"
      aria-labelledby={`user-${user.id}-name`}
      aria-describedby={`user-${user.id}-email`}
      aria-selected={isSelected}
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      <div className="selection">
        <input 
          type="checkbox"
          id={`user-select-${user.id}`}
          checked={isSelected}
          onChange={() => onSelect(user.id)}
          aria-label={`انتخاب ${user.name}`}
        />
        <label 
          htmlFor={`user-select-${user.id}`}
          className="selection-label"
          aria-hidden="true"
        >
          {isSelected ? '✓' : ''}
        </label>
      </div>
      
      <div className="avatar-container">
        {imgError ? (
          <div className="avatar-fallback">
            {user.name.split(' ').map(n => n[0]).join('')}
          </div>
        ) : (
          <img 
            src={user.avatar} 
            alt={`عکس پروفایل ${user.name}`}
            className="avatar"
            onError={handleImageError}
            loading="lazy"
            decoding="async"
          />
        )}
      </div>
      
      <div className="user-info">
        <h3 id={`user-${user.id}-name`} className="user-name">
          {user.name}
        </h3>
        <p id={`user-${user.id}-email`} className="user-email">
          {user.email}
        </p>
      </div>
    </div>
  );
};

export default UserCard;
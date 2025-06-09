// import React from 'react';
// import './UserCardSkeleton.css';

// const UserCardSkeleton = () => {
//   return (
//     <div className="user-card-skeleton">
//       <div className="skeleton-header">
//         <div className="skeleton-avatar"></div>
//         <div className="skeleton-info">
//           <div className="skeleton-name"></div>
//           <div className="skeleton-email"></div>
//         </div>
//       </div>
//       <div className="skeleton-body">
//         <div className="skeleton-detail"></div>
//         <div className="skeleton-detail"></div>
//         <div className="skeleton-detail"></div>
//       </div>
//       <div className="skeleton-footer">
//         <div className="skeleton-button"></div>
//         <div className="skeleton-button"></div>
//       </div>
//     </div>
//   );
// };

// export default UserCardSkeleton; 



// UserCardSkeleton.jsx
import React from 'react';
import './UserCardSkeleton.css';

const UserCardSkeleton = ({ count = 1 }) => {
  return (
    <>
      {[...Array(count)].map((_, index) => (
        <div 
          key={index}
          className="user-card-skeleton"
          aria-label="Loading user data"
          role="status"
          aria-live="polite"
        >
          <div className="skeleton-header">
            <div className="skeleton-avatar"></div>
            <div className="skeleton-info">
              <div className="skeleton-name"></div>
              <div className="skeleton-email"></div>
            </div>
          </div>
          
          <div className="skeleton-body">
            <div className="skeleton-detail"></div>
            <div className="skeleton-detail"></div>
            <div className="skeleton-detail"></div>
          </div>
          
          <div className="skeleton-footer">
            <div className="skeleton-button"></div>
            <div className="skeleton-button"></div>
          </div>
        </div>
      ))}
    </>
  );
};

export default UserCardSkeleton;
// import React from 'react';

// const LoadingSpinner = () => {
//   return (
//     <div className="loading-spinner">
//       <div className="spinner"></div>
//       <p>Loading...</p>
//     </div>
//   );
// };

// export default LoadingSpinner;




import React from 'react';

const LoadingSpinner = ({ size = 'medium', text = 'در حال بارگذاری...', fullPage = false }) => {
  // تعیین اندازه بر اساس prop
  const sizeStyles = {
    small: { width: 24, height: 24, borderWidth: 3 },
    medium: { width: 40, height: 40, borderWidth: 4 },
    large: { width: 60, height: 60, borderWidth: 5 }
  };
  
  const currentSize = sizeStyles[size] || sizeStyles.medium;
  
  return (
    <div 
      className={`loading-container ${fullPage ? 'full-page' : ''}`}
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label={text}
    >
      <div className="spinner-container">
        <div 
          className="spinner" 
          style={{
            width: currentSize.width,
            height: currentSize.height,
            borderWidth: currentSize.borderWidth
          }}
        >
          <div className="inner-spinner"></div>
        </div>
        <p className="loading-text">{text}</p>
      </div>
      
      {/* عنصر مخفی برای سئو */}
      <div className="sr-only" aria-hidden="true">
        محتوای صفحه در حال بارگذاری است. لطفاً منتظر بمانید.
      </div>
    </div>
  );
};

export default LoadingSpinner;
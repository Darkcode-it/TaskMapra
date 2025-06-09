// import React, { useState } from 'react';
// import './UserForm.css';

// const UserForm = ({ onSubmit }) => {
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     profileImage: null
//   });

//   const [errors, setErrors] = useState({});
//   const [loading, setLoading] = useState(false);
//   const [previewUrl, setPreviewUrl] = useState('');

//   const validateForm = () => {
//     const newErrors = {};
    
//     // نام
//     if (!formData.name.trim()) {
//       newErrors.name = 'نام الزامی است';
//     } else if (formData.name.length < 3) {
//       newErrors.name = 'نام باید حداقل 3 حرف باشد';
//     }

//     // ایمیل
//     if (!formData.email.trim()) {
//       newErrors.email = 'ایمیل الزامی است';
//     } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
//       newErrors.email = 'ایمیل نامعتبر است';
//     }

//     // تصویر پروفایل
//     if (!formData.profileImage) {
//       newErrors.profileImage = 'تصویر پروفایل الزامی است';
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setFormData(prev => ({
//         ...prev,
//         profileImage: file
//       }));

//       // ایجاد پیش‌نمایش تصویر
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setPreviewUrl(reader.result);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (validateForm()) {
//       setLoading(true);
//       try {
//         // شبیه‌سازی ارسال به API
//         await new Promise(resolve => setTimeout(resolve, 1500));
//         onSubmit(formData);
        
//         // پاک کردن فرم
//         setFormData({
//           name: '',
//           email: '',
//           profileImage: null
//         });
//         setPreviewUrl('');
//       } catch (error) {
//         console.error('Error submitting form:', error);
//       } finally {
//         setLoading(false);
//       }
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="user-form">
//       <div className="form-group">
//         <label htmlFor="name">نام</label>
//         <input
//           type="text"
//           id="name"
//           name="name"
//           value={formData.name}
//           onChange={handleChange}
//           className={errors.name ? 'error' : ''}
//           placeholder="نام خود را وارد کنید"
//         />
//         {errors.name && <span className="error-message">{errors.name}</span>}
//       </div>

//       <div className="form-group">
//         <label htmlFor="email">ایمیل</label>
//         <input
//           type="email"
//           id="email"
//           name="email"
//           value={formData.email}
//           onChange={handleChange}
//           className={errors.email ? 'error' : ''}
//           placeholder="ایمیل خود را وارد کنید"
//         />
//         {errors.email && <span className="error-message">{errors.email}</span>}
//       </div>

//       <div className="form-group">
//         <label htmlFor="profileImage">تصویر پروفایل</label>
//         <div className="image-upload-container">
//           <input
//             type="file"
//             id="profileImage"
//             name="profileImage"
//             onChange={handleImageChange}
//             accept="image/*"
//             className={errors.profileImage ? 'error' : ''}
//           />
//           {previewUrl && (
//             <div className="image-preview">
//               <img src={previewUrl} alt="پیش‌نمایش" />
//             </div>
//           )}
//         </div>
//         {errors.profileImage && <span className="error-message">{errors.profileImage}</span>}
//       </div>

//       <button type="submit" className="submit-button" disabled={loading}>
//         {loading ? (
//           <>
//             <span className="loading-spinner"></span>
//             در حال ارسال...
//           </>
//         ) : (
//           'ثبت کاربر'
//         )}
//       </button>
//     </form>
//   );
// };

// export default UserForm;



import React, { useState, useRef } from 'react';
import './UserForm.css';

const UserForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    profileImage: null
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  const fileInputRef = useRef(null);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'نام الزامی است';
    } else if (formData.name.length < 3) {
      newErrors.name = 'نام باید حداقل 3 حرف باشد';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'ایمیل الزامی است';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'ایمیل نامعتبر است';
    }

    if (!formData.profileImage) {
      newErrors.profileImage = 'تصویر پروفایل الزامی است';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate image type and size
    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    const maxSize = 2 * 1024 * 1024; // 2MB
    
    if (!validTypes.includes(file.type)) {
      setErrors(prev => ({ ...prev, profileImage: 'فرمت تصویر باید JPG, PNG یا GIF باشد' }));
      return;
    }
    
    if (file.size > maxSize) {
      setErrors(prev => ({ ...prev, profileImage: 'حجم تصویر نباید بیشتر از ۲ مگابایت باشد' }));
      return;
    }

    setFormData(prev => ({ ...prev, profileImage: file }));
    setPreviewUrl(URL.createObjectURL(file));
    
    if (errors.profileImage) {
      setErrors(prev => ({ ...prev, profileImage: '' }));
    }
  };

  const handleRemoveImage = () => {
    setPreviewUrl('');
    setFormData(prev => ({ ...prev, profileImage: null }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      onSubmit(formData);
      resetForm();
    } catch (error) {
      console.error('خطا در ارسال فرم:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      profileImage: null
    });
    setPreviewUrl('');
    setErrors({});
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className="user-form"
      aria-label="فرم ثبت کاربر"
    >
      <div className="form-group">
        <label htmlFor="name" className="required">
          نام
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={errors.name ? 'error' : ''}
          placeholder="نام خود را وارد کنید"
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? 'name-error' : undefined}
        />
        {errors.name && (
          <span id="name-error" className="error-message" role="alert">
            {errors.name}
          </span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="email" className="required">
          ایمیل
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className={errors.email ? 'error' : ''}
          placeholder="ایمیل خود را وارد کنید"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? 'email-error' : undefined}
        />
        {errors.email && (
          <span id="email-error" className="error-message" role="alert">
            {errors.email}
          </span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="profileImage" className="required">
          تصویر پروفایل
        </label>
        <div 
          className={`image-upload-container ${errors.profileImage ? 'error-border' : ''}`}
          onClick={() => fileInputRef.current.click()}
          role="button"
          tabIndex={0}
          aria-describedby={errors.profileImage ? 'image-error' : undefined}
          onKeyDown={(e) => e.key === 'Enter' && fileInputRef.current.click()}
        >
          <input
            type="file"
            id="profileImage"
            name="profileImage"
            onChange={handleImageChange}
            accept="image/*"
            ref={fileInputRef}
            hidden
          />
          
          {previewUrl ? (
            <div className="image-preview-container">
              <div className="image-preview">
                <img src={previewUrl} alt="پیش‌نمایش تصویر پروفایل" />
              </div>
              <button
                type="button"
                className="remove-image-button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveImage();
                }}
                aria-label="حذف تصویر"
              >
                &times;
              </button>
            </div>
          ) : (
            <div className="upload-instructions">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 13V19H5V13H3V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V13H19Z" fill="#3498db"/>
                <path d="M11 15L15 11L11 7V10H3V12H11V15Z" fill="#3498db"/>
              </svg>
              <p>برای آپلود تصویر کلیک کنید یا آن را اینجا بکشید</p>
              <p className="file-requirements">(فرمت‌های مجاز: JPG, PNG, GIF - حداکثر حجم: 2MB)</p>
            </div>
          )}
        </div>
        {errors.profileImage && (
          <span id="image-error" className="error-message" role="alert">
            {errors.profileImage}
          </span>
        )}
      </div>

      <div className="form-actions">
        <button 
          type="submit" 
          className="submit-button" 
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <span className="loading-spinner"></span>
              در حال ارسال...
            </>
          ) : (
            'ثبت کاربر'
          )}
        </button>
        
        <button
          type="button"
          className="reset-button"
          onClick={resetForm}
          disabled={isLoading}
        >
          پاک کردن فرم
        </button>
      </div>
    </form>
  );
};

export default UserForm;
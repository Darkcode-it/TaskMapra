// import React, { useState } from 'react';
// import UserForm from '../components/UserForm';
// import ExcelUploader from '../components/imgUploader';
// import LoadingSpinner from '../components/LoadingSpinner';
// import './AddUserPage.css';

// const AddUserPage = () => {
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (userData) => {
//     setLoading(true);
//     // شبیه‌سازی ارسال به API
//     await new Promise(resolve => setTimeout(resolve, 1500));
//     console.log('User added:', userData);
//     setLoading(false);
//     alert('کاربر با موفقیت اضافه شد!');
//   };

//   const handleExcelUpload = (users) => {
//     console.log('Uploaded users:', users);
//     // در اینجا می‌توانید کاربران را به API ارسال کنید
//     alert(`${users.length} کاربر از طریق فایل اکسل آپلود شدند!`);
//   };

//   return (
//     <div className="add-user-page">
//       <div className="page-header">
//         <h1>افزودن کاربر جدید</h1>
//         <p className="subtitle">افزودن یک کاربر یا آپلود چندین کاربر از طریق اکسل</p>
//       </div>
      
//       {loading ? (
//         <div className="loading-container">
//           <LoadingSpinner />
//         </div>
//       ) : (
//         <div className="content-grid">
//           <div className="form-section">
//             <h2>افزودن کاربر تکی</h2>
//             <UserForm onSubmit={handleSubmit} />
//           </div>
          
//           <div className="excel-section">
//             <h2>آپلود گروهی</h2>
//             <div className="excel-upload-container">
//               <ExcelUploader onUpload={handleExcelUpload} />
//               <p className="upload-hint">فایل اکسل حاوی اطلاعات کاربران را آپلود کنید</p>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AddUserPage;



import React, { useState, useEffect } from 'react';
import UserForm from '../components/UserForm';
import ExcelUploader from '../components/ExcelUploader';
import LoadingSpinner from '../components/LoadingSpinner';
import './AddUserPage.css';
import { Helmet } from 'react-helmet';

const AddUserPage = () => {
  const [formLoading, setFormLoading] = useState(false);
  const [excelLoading, setExcelLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const sectionRefs = [React.createRef(), React.createRef()];

  useEffect(() => {
    // اسکرول به بالا هنگام بارگیری صفحه
    window.scrollTo(0, 0);
    
    // افزودن انیمیشن‌های اسکرول
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    sectionRefs.forEach(ref => {
      if (ref.current) observer.observe(ref.current);
    });

    return () => {
      sectionRefs.forEach(ref => {
        if (ref.current) observer.unobserve(ref.current);
      });
    };
  }, []);

  const handleSubmit = async (userData) => {
    setFormLoading(true);
    setSuccessMessage('');
    setErrorMessage('');
    
    try {
      // شبیه‌سازی ارسال به API
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log('User added:', userData);
      
      setSuccessMessage('کاربر با موفقیت اضافه شد!');
      
      // پاک کردن پیام پس از 5 ثانیه
      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (error) {
      setErrorMessage('خطا در ثبت کاربر. لطفاً مجدداً تلاش کنید.');
      console.error('Error adding user:', error);
    } finally {
      setFormLoading(false);
    }
  };

  const handleExcelUpload = async (users) => {
    setExcelLoading(true);
    setSuccessMessage('');
    setErrorMessage('');
    
    try {
      // شبیه‌سازی پردازش و ارسال به API
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Uploaded users:', users);
      
      setSuccessMessage(`${users.length} کاربر از طریق فایل اکسل آپلود شدند!`);
      
      // پاک کردن پیام پس از 5 ثانیه
      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (error) {
      setErrorMessage('خطا در پردازش فایل اکسل. لطفاً فایل را بررسی کنید.');
      console.error('Error processing Excel:', error);
    } finally {
      setExcelLoading(false);
    }
  };

  return (
    <main className="add-user-page">
      {/* بهبود سئو با مدیریت متا تگ‌ها */}
      <Helmet>
        <title>افزودن کاربر جدید | سامانه مدیریت کاربران</title>
        <meta name="description" content="افزودن کاربر جدید به صورت تکی یا گروهی از طریق فایل اکسل در سامانه مدیریت کاربران" />
        <meta name="keywords" content="مدیریت کاربران, افزودن کاربر, آپلود اکسل, فرم ثبت نام" />
      </Helmet>
      
      <div className="page-header">
        <h1>افزودن کاربر جدید</h1>
        <p className="subtitle">افزودن یک کاربر یا آپلود چندین کاربر از طریق اکسل</p>
      </div>
      
      {/* نمایش پیام‌های موفقیت/خطا */}
      {successMessage && (
        <div className="success-message" role="alert">
          {successMessage}
        </div>
      )}
      
      {errorMessage && (
        <div className="error-message" role="alert">
          {errorMessage}
        </div>
      )}

      <div className="content-grid">
        {/* بخش فرم کاربر */}
        <section 
          className="form-section" 
          ref={sectionRefs[0]}
          aria-labelledby="single-user-title"
        >
          <h2 id="single-user-title">افزودن کاربر تکی</h2>
          <UserForm onSubmit={handleSubmit} isLoading={formLoading} />
          
          {formLoading && (
            <div className="loading-container">
              <LoadingSpinner />
              <p>در حال ثبت کاربر...</p>
            </div>
          )}
        </section>
        
        {/* بخش آپلود اکسل */}
        <section 
          className="excel-section" 
          ref={sectionRefs[1]}
          aria-labelledby="excel-upload-title"
        >
          <h2 id="excel-upload-title">آپلود گروهی</h2>
          <div className="excel-upload-container">
            <ExcelUploader 
              onUpload={handleExcelUpload} 
              isLoading={excelLoading} 
            />
            
            <div className="upload-instructions">
              <p className="upload-hint">فایل اکسل حاوی اطلاعات کاربران را آپلود کنید</p>
              <ul className="format-list">
                <li>فرمت‌های قابل قبول: XLSX، XLS، CSV</li>
                <li>حداکثر حجم فایل: 5 مگابایت</li>
                <li>ساختار استاندارد: نام، ایمیل، آدرس تصویر</li>
              </ul>
              <a 
                href="/sample-users.xlsx" 
                download="sample-users.xlsx"
                className="download-sample"
              >
                دانلود نمونه فایل اکسل
              </a>
            </div>
          </div>
          
          {excelLoading && (
            <div className="loading-container">
              <LoadingSpinner />
              <p>در حال پردازش فایل...</p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
};

export default AddUserPage;
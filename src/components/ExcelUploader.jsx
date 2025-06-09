import React, { useState, useRef } from 'react';
import * as XLSX from 'xlsx';
import './ExcelUploader.css';
import { FiUploadCloud, FiFile, FiCheckCircle } from 'react-icons/fi';

const ExcelUploader = ({ onUpload }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState('');
  const fileInputRef = useRef(null);

  const validateFile = (file) => {
    // بررسی نوع فایل
    const validTypes = ['xlsx', 'xls', 'csv'];
    const extension = file.name.split('.').pop().toLowerCase();
    
    if (!validTypes.includes(extension)) {
      setError('فرمت فایل نامعتبر است. لطفاً فایل اکسل (xlsx, xls) یا CSV آپلود کنید.');
      return false;
    }
    
    // بررسی حجم فایل (حداکثر 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setError(`حجم فایل بیش از حد مجاز است (حداکثر ${formatFileSize(maxSize)})`);
      return false;
    }
    
    return true;
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' بایت';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' کیلوبایت';
    return (bytes / 1048576).toFixed(1) + ' مگابایت';
  };

  const processFile = async (file) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);
      setFileName(file.name);
      setFileSize(formatFileSize(file.size));

      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
          const jsonData = XLSX.utils.sheet_to_json(firstSheet);

          // اعتبارسنجی ساختار فایل
          if (jsonData.length === 0) {
            throw new Error('فایل بارگذاری شده فاقد داده است');
          }

          // بررسی وجود ستون‌های ضروری
          const firstRow = jsonData[0];
          const hasName = Object.keys(firstRow).some(key => 
            ['name', 'نام', 'fullname', 'fullName'].includes(key.toLowerCase())
          );
          
          const hasEmail = Object.keys(firstRow).some(key => 
            ['email', 'ایمیل', 'mail'].includes(key.toLowerCase())
          );
          
          if (!hasName || !hasEmail) {
            throw new Error('فایل باید شامل ستون‌های "نام" و "ایمیل" باشد');
          }

          // تبدیل داده‌ها به فرمت استاندارد
          const formattedData = jsonData.map(row => {
            const nameKey = Object.keys(row).find(key => 
              ['name', 'نام', 'fullname', 'fullName'].includes(key.toLowerCase())
            );
            
            const emailKey = Object.keys(row).find(key => 
              ['email', 'ایمیل', 'mail'].includes(key.toLowerCase())
            );
            
            return {
              name: row[nameKey] || '',
              email: row[emailKey] || '',
              // سایر فیلدها را می‌توانید اینجا اضافه کنید
            };
          });

          onUpload(formattedData);
          setSuccess(true);
        } catch (err) {
          setError(err.message || 'خطا در پردازش فایل');
          console.error('Error processing file:', err);
        } finally {
          setLoading(false);
        }
      };

      reader.onerror = () => {
        setError('خطا در خواندن فایل');
        setLoading(false);
      };

      reader.readAsArrayBuffer(file);
    } catch (err) {
      setError(err.message || 'خطا در آپلود فایل');
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (validateFile(file)) {
      processFile(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && validateFile(file)) {
      processFile(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const resetUploader = () => {
    setFileName('');
    setFileSize('');
    setSuccess(false);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="excel-uploader">
      <div 
        className={`upload-area ${loading ? 'loading' : ''} ${success ? 'success' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <input
          ref={fileInputRef}
          type="file"
          id="excel-file"
          onChange={handleFileChange}
          accept=".xlsx,.xls,.csv"
          disabled={loading}
        />
        <label htmlFor="excel-file">
          {loading ? (
            <>
              <span className="loading-spinner"></span>
              در حال پردازش...
            </>
          ) : success ? (
            <>
              <FiCheckCircle className="success-icon" />
              <span className="success-text">فایل با موفقیت آپلود شد</span>
            </>
          ) : (
            <>
              <FiUploadCloud className="upload-icon" />
              <span className="upload-text">
                فایل اکسل یا CSV را اینجا رها کنید یا کلیک کنید
              </span>
            </>
          )}
        </label>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      {fileName && (
        <div className="file-info">
          <FiFile className="file-icon" />
          <span className="file-name">{fileName}</span>
          <span className="file-size">({fileSize})</span>
          {success && (
            <button className="reset-button" onClick={resetUploader}>
              آپلود مجدد
            </button>
          )}
        </div>
      )}
      
      <div className="upload-info">
        <p>فرمت‌های پشتیبانی شده: XLSX, XLS, CSV</p>
        <p>حداکثر حجم فایل: 5MB</p>
        <p>ساختار پیشنهادی فایل:</p>
        <ul>
          <li>نام (name)</li>
          <li>ایمیل (email)</li>
        </ul>
      </div>
    </div>
  );
};

export default ExcelUploader;
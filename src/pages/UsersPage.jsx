// import React, { useState, useEffect } from 'react';
// import UserCard from '../components/UserCard';
// import { fetchUsers } from '../components/api/userApi';
// import { loadSelectedUsers, saveSelectedUsers } from '../components/utils/storage';
// import './UsersPage.css';

// const USERS_PER_PAGE = 50;
// const TOTAL_USERS = 500;

// const UsersPage = () => {
//   const [users, setUsers] = useState([]);
//   const [selectedIds, setSelectedIds] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [hasMore, setHasMore] = useState(true);

//   useEffect(() => {
//     const getUsers = async () => {
//       try {
//         setLoading(true);
//         const data = await fetchUsers(USERS_PER_PAGE);
//         setUsers(data);
        
//         // بارگذاری انتخاب‌های قبلی از localStorage
//         const savedSelections = loadSelectedUsers();
//         if (savedSelections) {
//           setSelectedIds(savedSelections);
//         }
//       } catch (err) {
//         setError('خطا در بارگذاری کاربران');
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     getUsers();
//   }, []);

//   useEffect(() => {
//     // ذخیره انتخاب‌ها در localStorage هنگام تغییر
//     saveSelectedUsers(selectedIds);
//   }, [selectedIds]);

//   const handleSelectUser = (id) => {
//     setSelectedIds(prev => 
//       prev.includes(id) 
//         ? prev.filter(userId => userId !== id) 
//         : [...prev, id]
//     );
//   };

//   const handleLoadMore = async () => {
//     try {
//       setLoading(true);
//       const nextPage = currentPage + 1;
//       const startIndex = (nextPage - 1) * USERS_PER_PAGE;
      
//       // شبیه‌سازی دریافت کاربران جدید
//       const newUsers = await fetchUsers(USERS_PER_PAGE);
      
//       setUsers(prevUsers => [...prevUsers, ...newUsers]);
//       setCurrentPage(nextPage);
      
//       // بررسی آیا به انتهای لیست رسیده‌ایم
//       if (startIndex + USERS_PER_PAGE >= TOTAL_USERS) {
//         setHasMore(false);
//       }
//     } catch (err) {
//       setError('خطا در بارگذاری کاربران بیشتر');
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading && users.length === 0) {
//     return (
//       <div className="loading-container">
//         <div className="loading-spinner"></div>
//         <p>در حال بارگذاری کاربران...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="error-container">
//         <div className="error-message">
//           <span className="error-icon">⚠️</span>
//           <p>{error}</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="users-page">
//       <div className="page-header">
//         <h1>لیست کاربران</h1>
//         <div className="stats">
//           <span className="total-users">تعداد کل: {users.length}</span>
//           <span className="selected-users">انتخاب شده: {selectedIds.length}</span>
//         </div>
//       </div>

//       <div className="user-grid">
//         {users.map(user => (
//           <UserCard 
//             key={user.id}
//             user={user}
//             isSelected={selectedIds.includes(user.id)}
//             onSelect={handleSelectUser}
//           />
//         ))}
//       </div>

//       {hasMore && (
//         <div className="load-more-container">
//           <button 
//             className="load-more-button"
//             onClick={handleLoadMore}
//             disabled={loading}
//           >
//             {loading ? 'در حال بارگذاری...' : 'نمایش کاربران بیشتر'}
//           </button>
//         </div>
//       )}

//       {!hasMore && users.length > 0 && (
//         <div className="end-message">
//           <p>به انتهای لیست کاربران رسیدید</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default UsersPage;



import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import UserCard from '../components/UserCard';
import UserCardSkeleton from '../components/UserCardSkeleton';
import { fetchUsers } from '../components/api/userApi';
import { loadSelectedUsers, saveSelectedUsers } from '../components/utils/storage';
import './UsersPage.css';
import ScrollToTopButton from '../components/ScrollToTopButton';
import SearchBar from '../components/SearchBar';

const USERS_PER_PAGE = 50;
const TOTAL_USERS = 500;

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSelectedOnly, setShowSelectedOnly] = useState(false);

  // بارگیری اولیه کاربران
  useEffect(() => {
    const getUsers = async () => {
      try {
        setLoading(true);
        const data = await fetchUsers(USERS_PER_PAGE);
        setUsers(data);
        setFilteredUsers(data);
        
        // بارگذاری انتخاب‌های قبلی از localStorage
        const savedSelections = loadSelectedUsers();
        if (savedSelections) {
          setSelectedIds(savedSelections);
        }
      } catch (err) {
        setError('خطا در بارگذاری کاربران');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    getUsers();
  }, []);

  // ذخیره انتخاب‌ها در localStorage هنگام تغییر
  useEffect(() => {
    saveSelectedUsers(selectedIds);
  }, [selectedIds]);

  // اعمال فیلتر جستجو
  useEffect(() => {
    let result = users;
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(user => 
        user.name.toLowerCase().includes(query) || 
        user.email.toLowerCase().includes(query)
      );
    }
    
    if (showSelectedOnly) {
      result = result.filter(user => selectedIds.includes(user.id));
    }
    
    setFilteredUsers(result);
  }, [users, searchQuery, showSelectedOnly, selectedIds]);

  // بارگیری کاربران بیشتر
  const handleLoadMore = useCallback(async () => {
    if (!hasMore || loadingMore) return;
    
    try {
      setLoadingMore(true);
      const nextPage = currentPage + 1;
      const newUsers = await fetchUsers(USERS_PER_PAGE);
      
      setUsers(prevUsers => [...prevUsers, ...newUsers]);
      setCurrentPage(nextPage);
      
      // بررسی آیا به انتهای لیست رسیده‌ایم
      if (nextPage * USERS_PER_PAGE >= TOTAL_USERS) {
        setHasMore(false);
      }
    } catch (err) {
      setError('خطا در بارگذاری کاربران بیشتر');
      console.error(err);
    } finally {
      setLoadingMore(false);
    }
  }, [currentPage, hasMore, loadingMore]);

  // انتخاب/لغو انتخاب کاربر
  const handleSelectUser = useCallback((id) => {
    setSelectedIds(prev => 
      prev.includes(id) 
        ? prev.filter(userId => userId !== id) 
        : [...prev, id]
    );
  }, []);

  // انتخاب همه/هیچکدام
  const toggleSelectAll = useCallback(() => {
    if (selectedIds.length === filteredUsers.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredUsers.map(user => user.id));
    }
  }, [filteredUsers, selectedIds.length]);

  // آمار کاربران
  const stats = useMemo(() => {
    const selectedCount = selectedIds.length;
    const visibleCount = filteredUsers.length;
    const totalCount = users.length;
    
    return {
      selectedCount,
      visibleCount,
      totalCount,
      selectedPercentage: totalCount > 0 ? Math.round((selectedCount / totalCount) * 100) : 0
    };
  }, [selectedIds.length, filteredUsers.length, users.length]);

  // رندر محتوای اصلی
  const renderContent = () => {
    if (loading && users.length === 0) {
      return (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>در حال بارگذاری کاربران...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="error-container">
          <div className="error-message">
            <span className="error-icon">⚠️</span>
            <p>{error}</p>
            <button 
              className="retry-button"
              onClick={() => window.location.reload()}
            >
              تلاش مجدد
            </button>
          </div>
        </div>
      );
    }

    return (
      <>
        <div className="user-grid">
          {filteredUsers.map(user => (
            <UserCard 
              key={user.id}
              user={user}
              isSelected={selectedIds.includes(user.id)}
              onSelect={handleSelectUser}
            />
          ))}
        </div>

        {filteredUsers.length === 0 && (
          <div className="no-results">
            <p>هیچ کاربری یافت نشد</p>
            <button 
              className="clear-filters-button"
              onClick={() => {
                setSearchQuery('');
                setShowSelectedOnly(false);
              }}
            >
              پاک کردن فیلترها
            </button>
          </div>
        )}

        {loadingMore && (
          <div className="skeleton-grid">
            {Array.from({ length: 5 }).map((_, index) => (
              <UserCardSkeleton key={`skeleton-${index}`} />
            ))}
          </div>
        )}

        {hasMore && !loadingMore && filteredUsers.length > 0 && (
          <div className="load-more-container">
            <button 
              className="load-more-button"
              onClick={handleLoadMore}
              aria-label="بارگذاری کاربران بیشتر"
            >
              نمایش کاربران بیشتر
            </button>
          </div>
        )}

        {!hasMore && users.length > 0 && (
          <div className="end-message">
            <p>به انتهای لیست کاربران رسیدید</p>
            <p className="stats-summary">
              نمایش {filteredUsers.length} کاربر از {users.length} کاربر
              {selectedIds.length > 0 && ` | ${selectedIds.length} کاربر انتخاب شده`}
            </p>
          </div>
        )}
      </>
    );
  };

  return (
    <main className="users-page">
      {/* بهبود سئو با مدیریت متا تگ‌ها */}
      <Helmet>
        <title>لیست کاربران | سامانه مدیریت کاربران</title>
        <meta name="description" content="مدیریت و مشاهده لیست کاربران در سامانه مدیریت کاربران" />
        <meta name="keywords" content="لیست کاربران, مدیریت کاربران, انتخاب کاربر, فیلتر کاربران" />
      </Helmet>

      <div className="page-header">
        <h1>لیست کاربران</h1>
        
        <div className="controls-container">
          <SearchBar 
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="جستجوی کاربران..."
          />
          
          <div className="filters">
            <label className="filter-toggle">
              <input
                type="checkbox"
                checked={showSelectedOnly}
                onChange={() => setShowSelectedOnly(!showSelectedOnly)}
              />
              نمایش فقط انتخاب‌شده‌ها
            </label>
            
            <button 
              className="select-all-button"
              onClick={toggleSelectAll}
              disabled={filteredUsers.length === 0}
            >
              {selectedIds.length === filteredUsers.length 
                ? 'لغو انتخاب همه' 
                : 'انتخاب همه'}
            </button>
          </div>
        </div>
        
        <div className="stats">
          <div className="stat-item">
            <span className="stat-label">کل کاربران:</span>
            <span className="stat-value">{stats.totalCount}</span>
          </div>
          
          <div className="stat-item">
            <span className="stat-label">نمایش داده شده:</span>
            <span className="stat-value">{stats.visibleCount}</span>
          </div>
          
          <div className="stat-item highlight">
            <span className="stat-label">انتخاب شده:</span>
            <span className="stat-value">{stats.selectedCount}</span>
            {stats.totalCount > 0 && (
              <span className="stat-percentage">({stats.selectedPercentage}%)</span>
            )}
          </div>
        </div>
      </div>

      {renderContent()}
      
      <ScrollToTopButton />
    </main>
  );
};

export default UsersPage;
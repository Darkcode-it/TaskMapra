const SELECTED_USERS_KEY = 'selectedUsers';

export const saveSelectedUsers = (userIds) => {
  try {
    localStorage.setItem(SELECTED_USERS_KEY, JSON.stringify(userIds));
  } catch (error) {
    console.error('Error saving to localStorage', error);
  }
};

export const loadSelectedUsers = () => {
  try {
    const data = localStorage.getItem(SELECTED_USERS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading from localStorage', error);
    return [];
  }
};
import axios from 'axios';

export const fetchUsers = async (count = 500) => {
  try {
    const response = await axios.get(`https://randomuser.me/api/?results=${count}`);
    return response.data.results.map((user, index) => ({
      id: `${user.login.uuid}-${index}`,
      name: `${user.name.first} ${user.name.last}`,
      email: user.email,
      avatar: user.picture.large
    }));
  } catch (error) {
    throw new Error('Failed to fetch users');
  }
};
export const saveUserLoginStatus = (isLoggedIn) => {
  localStorage.setItem('isLoggedIn', isLoggedIn);
};

export const checkUserLoginStatus = () => {
  return localStorage.getItem('isLoggedIn') === 'true';
};

export const logoutUser = () => {
  localStorage.removeItem('isLoggedIn');
  localStorage.removeItem('userLogin'); // Удаляем логин пользователя при выходе
};
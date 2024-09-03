// // src/context/AuthProvider.js
// import React, { createContext, useReducer, useEffect, useContext } from 'react';
// import authReducer from './authReducer';
// import { loginUser, logoutUser } from './authActions';

// const AuthContext = createContext();

// export const useAuth = () => useContext(AuthContext);  // Correctly export useAuth

// export const AuthProvider = ({ children }) => {
//   const [state, dispatch] = useReducer(authReducer, { user: null, token: null });

//   const isAuthenticated = !!state.token;
//   const role = state.user ? state.user.role : null;

// //   useEffect(() => {
// //     const token = localStorage.getItem('token');
// //     const user = localStorage.getItem('user');

// //     if (token && user) {
// //       try {
// //         const parsedUser = JSON.parse(user);
// //         console.log("old data dispatch ", parsedUser, token);
// //         dispatch(loginUser({ user: parsedUser, token }));
// //       } catch (error) {
// //         console.error('Error parsing user from local storage:', error);
// //       }
// //     }
// //   }, []);

//   const login = (userData) => {
//     if (userData && userData.token && userData.user) {
//         console.log("login dispatch :::::::::::: ", userData);
        
//       dispatch(loginUser(userData));
//       localStorage.setItem('token', userData.token);
//       localStorage.setItem('user', JSON.stringify(userData.user));
//     } else {
//       console.error('Invalid userData provided for login:', userData);
//     }
//   };

//   const logout = () => {
//     dispatch(logoutUser());
//     localStorage.removeItem('token');
//     localStorage.removeItem('user');
//   };

//   return (
//     <AuthContext.Provider value={{ state, isAuthenticated, role, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// // src/context/authReducer.js
// import { LOGIN, LOGOUT } from './authActions';

// const initialState = {
//   user: null,
//   token: null,
// };

// const authReducer = (state = initialState, action) => {
//     console.log("Action received:", action);
//     console.log("Current state before update:", state);
//     console.log("Payload data:", action.payload);
      
//     switch (action.type) {
//       case LOGIN:
//         return { ...state, user: action.payload.user, token: action.payload.token };
//       case LOGOUT:
//         return { ...state, user: null, token: null };
//       default:
//         return state;
//     }
//   };

// export default authReducer;

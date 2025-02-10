// authSlice.js
import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isAuthenticated: false,
    user: null,  // The user will be stored here
  },
  reducers: {
    login(state, action) {
      state.isAuthenticated = true;
      state.user = action.payload;  // Store the user data (including id)
    },
    logout(state) {
      state.isAuthenticated = false;
      state.user = null;
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;

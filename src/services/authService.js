// ============================================================
// authService.js
// Auth-specific logic (register, login, delete).
// Uses storageService — swap to Firebase here in Phase 3.
// ============================================================

import {
  findUser,
  addUser,
  updateUser,
  deleteUser,
  userIdExists,
} from "./storageService";

export const loginUser = (loginId, password) => {
  const user = findUser(loginId, password);
  if (!user) return { success: false, error: "Invalid credentials." };
  return { success: true, user };
};

export const registerUser = (formData, role) => {
  if (userIdExists(formData.userId)) {
    return { success: false, error: "User ID already taken. Choose another." };
  }
  const newUser = {
    ...formData,
    role,
    id: Date.now(),
  };
  addUser(newUser);
  return { success: true };
};

export const updateProfile = (updatedUser) => {
  updateUser(updatedUser);
  return { success: true };
};

export const deleteAccount = (userId) => {
  deleteUser(userId);
  return { success: true };
};
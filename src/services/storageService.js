// ============================================================
// storageService.js
// ALL localStorage operations live here.
// Phase 3: Replace these functions with Firebase calls.
// ============================================================

const USERS_KEY = "fl_users";
const DONATIONS_KEY = "fl_donations";

// ---------- USER OPERATIONS ----------

export const getUsers = () => {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
  } catch {
    return [];
  }
};

export const saveUsers = (users) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const getUserById = (userId) => {
  return getUsers().find((u) => u.userId === userId) || null;
};

export const addUser = (user) => {
  const users = getUsers();
  users.push(user);
  saveUsers(users);
};

export const updateUser = (updatedUser) => {
  const users = getUsers().map((u) =>
    u.userId === updatedUser.userId ? updatedUser : u
  );
  saveUsers(users);
};

export const deleteUser = (userId) => {
  const users = getUsers().filter((u) => u.userId !== userId);
  saveUsers(users);
};

export const findUser = (loginId, password) => {
  return (
    getUsers().find(
      (u) =>
        (u.email === loginId || u.userId === loginId) &&
        u.password === password
    ) || null
  );
};

export const userIdExists = (userId) => {
  return getUsers().some((u) => u.userId === userId);
};

// ---------- DONATION OPERATIONS ----------

export const getDonations = () => {
  try {
    return JSON.parse(localStorage.getItem(DONATIONS_KEY)) || [];
  } catch {
    return [];
  }
};

export const saveDonations = (donations) => {
  localStorage.setItem(DONATIONS_KEY, JSON.stringify(donations));
};

export const addDonation = (donation) => {
  const all = getDonations();
  saveDonations([donation, ...all]);
};

export const deleteDonation = (id) => {
  const filtered = getDonations().filter((d) => d.id !== id);
  saveDonations(filtered);
};

export const claimDonation = (donationId, claimedByUserId) => {
  const updated = getDonations().map((d) =>
    d.id === donationId
      ? { ...d, status: "Claimed", claimedBy: claimedByUserId }
      : d
  );
  saveDonations(updated);
};

export const cancelClaim = (donationId) => {
  const updated = getDonations().map((d) =>
    d.id === donationId
      ? { ...d, status: "Available", claimedBy: null }
      : d
  );
  saveDonations(updated);
};

// Marks expired donations — call this on every load
export const syncExpiredDonations = () => {
  const now = Date.now();
  const updated = getDonations().map((d) => {
    if (d.status === "Available" && d.expiry && now > d.expiry) {
      return { ...d, status: "Expired" };
    }
    return d;
  });
  saveDonations(updated);
  return updated;
};

export const getDonationsForUser = (userId) => {
  return getDonations().filter((d) => d.userId === userId);
};

export const getAvailableDonations = () => {
  const now = Date.now();
  return getDonations().filter(
    (d) => d.status === "Available" && d.expiry > now
  );
};

export const getClaimedByUser = (userId) => {
  return getDonations().filter(
    (d) => d.status === "Claimed" && d.claimedBy === userId
  );
};

export const getExpiredCount = () => {
  return getDonations().filter((d) => d.status === "Expired").length;
};
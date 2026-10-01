// In-memory fallback data store for offline development and testing
// Primary production persistence is handled directly via MongoDB Atlas
import pkg from 'bcryptjs';
const { hashSync } = pkg;

if (!globalThis.__dataStore_users) {
  globalThis.__dataStore_users = [];
}
if (!globalThis.__dataStore_items) {
  globalThis.__dataStore_items = [];
}
if (!globalThis.__dataStore_answers) {
  globalThis.__dataStore_answers = [];
}
if (!globalThis.__dataStore_messages) {
  globalThis.__dataStore_messages = [];
}

export const dataStore = {
  getUsers: () => globalThis.__dataStore_users,
  findUserByEmail: (email) =>
    globalThis.__dataStore_users.find(
      (u) => u.email.toLowerCase() === (email || '').toLowerCase()
    ),
  findUserById: (id) =>
    globalThis.__dataStore_users.find((u) => u._id === id),
  addUser: (user) => {
    let hashedPassword = user.password;
    if (hashedPassword && !hashedPassword.startsWith('$2a$') && !hashedPassword.startsWith('$2b$')) {
      hashedPassword = hashSync(hashedPassword, 10);
    }
    const newUser = {
      _id: `user_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      createdAt: new Date().toISOString(),
      date: new Date().toISOString(),
      ...user,
      password: hashedPassword,
    };
    globalThis.__dataStore_users.push(newUser);
    return newUser;
  },

  getItems: () => globalThis.__dataStore_items,
  findItemById: (id) =>
    globalThis.__dataStore_items.find((i) => i._id === id),
  addItem: (item) => {
    const newItem = {
      _id: `item_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      status: true,
      createdAt: new Date().toISOString(),
      date: new Date().toISOString(),
      ...item,
    };
    globalThis.__dataStore_items.unshift(newItem);
    return newItem;
  },
  updateItem: (id, updates) => {
    const idx = globalThis.__dataStore_items.findIndex((i) => i._id === id);
    if (idx !== -1) {
      globalThis.__dataStore_items[idx] = {
        ...globalThis.__dataStore_items[idx],
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      return globalThis.__dataStore_items[idx];
    }
    return null;
  },
  deleteItem: (id) => {
    globalThis.__dataStore_items = globalThis.__dataStore_items.filter((i) => i._id !== id);
    return true;
  },

  getAnswers: () => globalThis.__dataStore_answers,
  getAnswersByItemId: (itemId) =>
    globalThis.__dataStore_answers.filter((a) => a.itemId === itemId),
  getAnswersByGivenBy: (userId) =>
    globalThis.__dataStore_answers.filter((a) => a.givenBy === userId),
  addAnswer: (answer) => {
    const newAnswer = {
      _id: `ans_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      response: 'Moderation',
      createdAt: new Date().toISOString(),
      date: new Date().toISOString(),
      ...answer,
    };
    globalThis.__dataStore_answers.unshift(newAnswer);
    return newAnswer;
  },
  updateAnswerResponse: (answerId, response) => {
    const ans = globalThis.__dataStore_answers.find((a) => a._id === answerId);
    if (ans) {
      ans.response = response;
      return ans;
    }
    return null;
  },

  addMessage: (msg) => {
    globalThis.__dataStore_messages.push({
      id: `msg_${Date.now()}`,
      createdAt: new Date().toISOString(),
      ...msg,
    });
    return true;
  },
};

export default dataStore;

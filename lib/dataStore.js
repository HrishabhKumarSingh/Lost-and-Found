// Shared in-memory data store for local development and demonstration
// Uses globalThis to ensure state is preserved across Next.js route bundles and hot-reloads

const initialUsers = [
  {
    _id: 'user_demo_1',
    firstname: 'Demo',
    lastname: 'User',
    email: 'demo@example.com',
    number: '+1 (555) 019-2834',
    password: 'password123',
  },
  {
    _id: 'user_jane_2',
    firstname: 'Jane',
    lastname: 'Doe',
    email: 'jane@example.com',
    number: '+1 (555) 456-7890',
    password: 'password123',
  },
];

const initialItems = [
  {
    _id: 'item_1',
    name: 'MacBook Pro 14" (Space Grey)',
    description: 'Left in the campus library 2nd floor study area near the window. Has a green GitHub Octocat sticker on the lid.',
    question: 'What is the sticker on the back of the laptop?',
    type: 'Lost',
    status: true,
    createdBy: 'user_demo_1',
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    itemPictures: [
      { img: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=60' },
    ],
  },
  {
    _id: 'item_2',
    name: 'Black Leather Bifold Wallet',
    description: 'Found on the bench outside the cafeteria. Contains a MetroCard and university ID card with name initial M.',
    question: 'What brand name is embossed on the inner corner of the wallet?',
    type: 'Found',
    status: true,
    createdBy: 'user_jane_2',
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    itemPictures: [
      { img: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&auto=format&fit=crop&q=60' },
    ],
  },
  {
    _id: 'item_3',
    name: 'Sony WH-1000XM4 Headphones',
    description: 'Black over-ear wireless headphones inside a black zipper case. Missing near the science auditorium.',
    question: 'What color is the carabiner clip attached to the zipper case?',
    type: 'Lost',
    status: true,
    createdBy: 'user_jane_2',
    createdAt: new Date(Date.now() - 3600000 * 28).toISOString(),
    itemPictures: [
      { img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=60' },
    ],
  },
  {
    _id: 'item_4',
    name: 'Keychain with 3 Keys & Car Fob',
    description: 'Found near parking lot B. Has a red woven fabric strap and a Toyota car fob.',
    question: 'What slogan or text is printed on the red strap?',
    type: 'Found',
    status: true,
    createdBy: 'user_demo_1',
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
    itemPictures: [
      { img: 'https://images.unsplash.com/photo-1589578527966-fdac0f44566c?w=800&auto=format&fit=crop&q=60' },
    ],
  },
];

const initialAnswers = [
  {
    _id: 'ans_1',
    itemId: 'item_1',
    question: 'What is the sticker on the back of the laptop?',
    answer: 'It has a green GitHub Octocat sticker and a tiny React logo sticker.',
    givenBy: 'user_jane_2',
    belongsTo: 'user_demo_1',
    response: 'Moderation',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    _id: 'ans_2',
    itemId: 'item_2',
    question: 'What brand name is embossed on the inner corner of the wallet?',
    answer: 'Fossil brand embossed in silver font.',
    givenBy: 'user_demo_1',
    belongsTo: 'user_jane_2',
    response: 'Yes',
    createdAt: new Date(Date.now() - 3600000 * 6).toISOString(),
  },
];

if (!globalThis.__dataStore_users) {
  globalThis.__dataStore_users = [...initialUsers];
}
if (!globalThis.__dataStore_items) {
  globalThis.__dataStore_items = [...initialItems];
}
if (!globalThis.__dataStore_answers) {
  globalThis.__dataStore_answers = [...initialAnswers];
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
    const newUser = { _id: `user_${Date.now()}_${Math.floor(Math.random()*1000)}`, ...user };
    globalThis.__dataStore_users.push(newUser);
    return newUser;
  },

  getItems: () => globalThis.__dataStore_items,
  findItemById: (id) =>
    globalThis.__dataStore_items.find((i) => i._id === id),
  addItem: (item) => {
    const newItem = {
      _id: `item_${Date.now()}_${Math.floor(Math.random()*1000)}`,
      status: true,
      createdAt: new Date().toISOString(),
      ...item,
    };
    globalThis.__dataStore_items.unshift(newItem);
    return newItem;
  },
  updateItem: (id, updates) => {
    const idx = globalThis.__dataStore_items.findIndex((i) => i._id === id);
    if (idx !== -1) {
      globalThis.__dataStore_items[idx] = { ...globalThis.__dataStore_items[idx], ...updates };
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
      _id: `ans_${Date.now()}_${Math.floor(Math.random()*1000)}`,
      response: 'Moderation',
      createdAt: new Date().toISOString(),
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

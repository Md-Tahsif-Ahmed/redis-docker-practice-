const User = require('../models/User');
const { invalidateByPattern } = require('../middlewares/cache');


const listUsers = async (req, res) => {
const users = await User.find().sort({ createdAt: -1 });
return res.json({ data: users });
};


const getUser = async (req, res) => {
const user = await User.findById(req.params.id);
if (!user) return res.status(404).json({ error: 'User not found' });
return res.json({ data: user });
};


const createUser = async (req, res) => {
const user = await User.create(req.body);
// Invalidate any users* cache after mutation
await invalidateByPattern('users:*');
return res.status(201).json({ data: user });
};


const updateUser = async (req, res) => {
const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
if (!user) return res.status(404).json({ error: 'User not found' });
await invalidateByPattern(`user:${req.params.id}`);
await invalidateByPattern('users:*');
return res.json({ data: user });
};


const deleteUser = async (req, res) => {
const user = await User.findByIdAndDelete(req.params.id);
if (!user) return res.status(404).json({ error: 'User not found' });
await invalidateByPattern(`user:${req.params.id}`);
await invalidateByPattern('users:*');
return res.status(204).json();
};


module.exports = { listUsers, getUser, createUser, updateUser, deleteUser };
const mongoose = require('mongoose');


const connectDB = async () => {
const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/redis_demo';
mongoose.set('strictQuery', true);
await mongoose.connect(uri, {
autoIndex: true
});
console.log('✅ MongoDB connected');
};


module.exports = { connectDB };
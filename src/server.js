require('dotenv').config();
const http = require('http');
const app = require('./app');
const { connectDB } = require('./config/db');
const { connectRedis } = require('./config/redis');


const PORT = process.env.PORT || 3000;


(async () => {
try {
await connectDB();
await connectRedis();


http.createServer(app).listen(PORT, () => {
console.log(`⚡ Server running on http://localhost:${PORT}`);
});
} catch (err) {
console.error('Startup error:', err);
process.exit(1);
}
})();
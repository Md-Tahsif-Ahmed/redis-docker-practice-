const { createClient } = require('redis');


let client;


const connectRedis = async () => {
if (client) return client;
client = createClient({
url: buildRedisURL()
});


client.on('error', (err) => console.error('Redis Client Error', err));
await client.connect();
console.log('✅ Redis connected');
return client;
};


const getRedis = () => {
if (!client) throw new Error('Redis not initialized yet');
return client;
};


function buildRedisURL() {
const host = process.env.REDIS_HOST || '127.0.0.1';
const port = process.env.REDIS_PORT || '6379';
const password = process.env.REDIS_PASSWORD;
if (password) return `redis://:${password}@${host}:${port}`;
return `redis://${host}:${port}`;
}


module.exports = { connectRedis, getRedis };
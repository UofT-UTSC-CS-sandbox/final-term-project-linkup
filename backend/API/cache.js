const redis = require('redis');
const client = redis.createClient({
    host: 'localhost', // or your Redis server IP/hostname
    port: 6379 // default Redis port
});

client.on('error', (err) => console.log('Redis Client Error', err));

// Connect to the Redis server
client.connect();

module.exports = {
    get: async (key) => {
        try {
            const value = await client.get(key);
            return JSON.parse(value);
        } catch (error) {
            console.error(`Error getting data from cache for key ${key}:`, error);
            return null;
        }
    },
    set: async (key, value, expiryTimeInSeconds) => {
        try {
            // 'EX' sets an expiry time in seconds
            await client.set(key, JSON.stringify(value), { EX: expiryTimeInSeconds });
        } catch (error) {
            console.error(`Error setting cache for key ${key}:`, error);
        }
    }
};
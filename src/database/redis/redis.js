require('dotenv').config();
const redis = require('redis');
class RedisDB {
    static client = redis.createClient({
        host: process.env.redisConnectionUrl,
        port: process.env.redisConnectionPort,
        password: process.env.redisPassword,
    });

    static connect() {
        this.client.on('connect', () => {
            console.log('Redis client connected');
        });
        this.client.on('error', (error) => {
            console.log('Redis not connected', error);
        });
    }
}
module.exports = RedisDB;

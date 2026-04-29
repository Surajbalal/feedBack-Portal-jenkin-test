const Redis = require('ioredis');
require('dotenv').config();

const client = new Redis({
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_PASSWORD || undefined,
    connectTimeout: 10000,

    retryStrategy: (times) => {
        return Math.min(times * 50, 2000);
    }
});

client.on('connect', () => {
    console.log('Redis connected');
});

client.on('ready', () => {
    console.log('Redis ready to use');
});

client.on('reconnecting', () => {
    console.log('Redis reconnecting...');
});

client.on('error', (err) => {
    console.error('Redis error:', err);
});

module.exports = client;
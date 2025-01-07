// const redis = require('redis');
// const redisClient = redis.createClient();

// redisClient.on('error', (err) => {
//   console.error('Redis error:', err);
// });

// redisClient.on('connect', () => {
//   console.log('Connected to Redis');
// });

// async function initializeRedis() {
//   if (!redisClient.isOpen) {
//     try {
//       await redisClient.connect();
//       console.log("Redis client connected successfully.");
//     } catch (err) {
//       console.error('Error connecting to Redis:', err);
//     }
//   }
// }

// initializeRedis();

// module.exports = redisClient;

const redis = require('redis');
const { promisify } = require('util');

class RedisClient {
  constructor() {
    this.client = redis.createClient();

    this.client.on('error', (error) => {
      console.error(error);
    });
  }

  isAlive() {
    return this.client.connected;
  }

  async get(key) {
    return promisify(this.client.get).bind(this.client)(key);
  }

  async set(key, value, duration) {
    await promisify(this.client.set).bind(this.client)(key, value);
    await promisify(this.client.expire).bind(this.client)(key, duration);
  }

  async del(key) {
    await promisify(this.client.del).bind(this.client)(key);
  }
}

module.exports = new RedisClient();

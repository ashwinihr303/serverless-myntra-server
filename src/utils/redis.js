'use strict'
const redis = require('async-redis');
const ms = require('ms');
const errorLog = require('./errorLogger');
const env = require("dotenv/config");
let redisClient;
class Redis {
  constructor() {
    this.prefix = process.env.redisCachingPrefix;
    this.ttl = ms(process.env.redisTTl) / 1000;
    this.client = redis.createClient(process.env.redisUrl);
  }
  async get(key) {
    let value;
    const redisKey = `${this.prefix}:${key}`;
    try {
      value = await this.client.get(redisKey);
      return JSON.parse(value);
    } catch (err) {
        errorLog(err, `key: ${redisKey}, value ${value}`);
      return '';
    }
  }
  async set(key, value) {
    const redisKey = `${this.prefix}:${key}`;
    try {
      const str = JSON.stringify(value);
      return await this.client.set(
        redisKey,
        str,
        'EX',
        this.ttl,
      );
    } catch (err) {
        errorLog(err, `key: ${redisKey}, value ${value}`);
      return err;
    }
  }
}
const createRedis = () => {
  redisClient = new Redis();
};
const getRedis = () => redisClient;
module.exports = {
  createRedis,
  getRedis,
};

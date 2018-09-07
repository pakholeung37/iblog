var redis = require('redis');
var config = require('../config/redis-config');
const logger = require('./logger');
var redisEnable = config.redis.enable;

if (redisEnable) {
    // use custom redis url or localhost
    var client = redis.createClient(config.redis.port || 6379, config.redis.host || 'localhost');
    client.on('error', function (err) {
        logger.error('Redis连接错误: ' + err);
        process.exit(1);
    });
    client.on('ready', (err)=>{
        logger.info("redis enable");
    })
}

/**
 * 设置缓存
 * @param key 缓存key
 * @param value 缓存value
 * @param expired 缓存的有效时长，单位秒
 * @param callback 回调函数
 */
exports.setItem = function (key, value, expired, callback) {
    if (!redisEnable) {
        return callback(null);
    }

    client.set(key, JSON.stringify(value), function (err) {
        if (err) {
            return callback(err);
        }
        if (expired) {
            client.expire(key, expired);
        }
        return callback(null);
    });
};

/**
 * 获取缓存
 * @param key 缓存key
 * @param callback 回调函数
 */
exports.getItem = function (key, callback) {
    if (!redisEnable) {
        return callback(null, null);
    }

    client.get(key, function (err, reply) {
        if (err) {
            return callback(err);
        }
        return callback(null, JSON.parse(reply));
    });
};

/**
 * 移除缓存
 * @param key 缓存key
 * @param callback 回调函数
 */
exports.removeItem = function (key, callback) {
    if (!redisEnable) {
        return callback(null);
    }

    client.del(key, function (err) {
        if (err) {
            return callback(err);
        }
        return callback(null);
    });
};

/**
 * 获取默认过期时间，单位秒
 */
exports.defaultExpired = parseInt(require('../config/settings').CacheExpired);

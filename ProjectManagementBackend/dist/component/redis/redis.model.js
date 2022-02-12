"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisConnection = void 0;
const redis_1 = require("redis");
class RedisConnection {
    constructor() {
        this.connectRedis();
    }
    async connectRedis() {
        if (!this.client) {
            this.client = (0, redis_1.createClient)({});
            await this.client.connect();
        }
    }
    getConnection() {
        return this.client;
    }
}
exports.RedisConnection = RedisConnection;
//# sourceMappingURL=redis.model.js.map
export declare class RedisConnection {
    private client;
    constructor();
    connectRedis(): Promise<void>;
    getConnection(): any;
}

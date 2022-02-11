import { createClient } from "redis";

export class RedisConnection{
    private client;
    constructor(){
        this.connectRedis()
    }
    async connectRedis(){
        if(!this.client){
            this.client = createClient({
                // name:process.env.REDIS_NAME,
                // password:process.env.REDIS_PASSWORD
            })
            await this.client.connect();
        }
    }
    getConnection(){
        return this.client;
    }
}
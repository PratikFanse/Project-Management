import { createClient } from "redis";

export class RedisConnection{
    private client;
    constructor(){
        this.connectRedis()
    }
    async connectRedis(){
        if(!this.client){
            this.client = createClient();
            await this.client.connect();
        }
    }
    getConnection(){
        return this.client;
    }
}
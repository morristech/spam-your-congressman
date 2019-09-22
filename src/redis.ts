import { promisify } from "util";
import { RedisClient } from "redis";
import * as env from "./env";

export interface AsyncRedisClient extends RedisClient {
  rpushAsync: (queue: string, message: string) => Promise<number>;
  blpopAsync: (queue: string, timeout: number) => Promise<[string, string]>;

  hgetAsync: (hash: string, field: string) => Promise<string | null>;
  hsetAsync: (hash: string, field: string, value: string) => Promise<number>;
  hmsetAsync: (
    keyValuePairs: [string, ...(string | number)[]]
  ) => Promise<"OK">;

  zaddAsync: (set: string, score: number, value: string) => Promise<number>;
  zrangeAsync: (
    set: string,
    start: number,
    stop: number,
    withScores?: "withscores"
  ) => Promise<string[]>;
}

export function createRedisClient(redis) {
  console.log("Creating redis client");
  const redisClient: AsyncRedisClient = redis.createClient({
    host: env.REDIS_HOST,
    port: env.REDIS_PORT
  }) as AsyncRedisClient;

  redisClient.rpushAsync = promisify(redisClient.rpush);
  redisClient.blpopAsync = promisify(redisClient.blpop);

  redisClient.hgetAsync = promisify(redisClient.hget);
  redisClient.hsetAsync = promisify(redisClient.hset);
  redisClient.hmsetAsync = promisify(redisClient.hmset);

  redisClient.zaddAsync = promisify(redisClient.zadd);
  redisClient.zrangeAsync = promisify(redisClient.zrange);

  console.log("Finished creating redis client");
  return redisClient;
}
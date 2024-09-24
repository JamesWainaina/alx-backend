import redis from "redis";

// create a Redis client
const client = redis.createClient();

client.on("connect", () => {
    console.log("Redis client connected to the server");
});

client.on("error", () => {
    console.error(`Redis client not connected to the server: ${error}`);
});

client.subscribe('holberton school channel');

// listen for messages on the subscribed channel
client.on('message', (channel, message) => {
    console.log(`${message}`);
    if (message === 'KILL_SERVER') {
        client.unsubscribe();
        client.quit();
    }
});


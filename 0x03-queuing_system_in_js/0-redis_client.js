import redis from 'redis'


const client = redis.createClient();

client.on("connect", () => {
    console.log("Redis client connected to the server");
});

client.on("error", (error) => {
    console.log(`Redis client not connected to the server: ${error}`);
});


// gracefully handle Ctrl + C (SIGINT) to close the redis connection
process.on('SIGINT', () => {
    client.quit(() => {
        console.log("Redis client disconnected from the server");
        process.exit(0);
    });
});
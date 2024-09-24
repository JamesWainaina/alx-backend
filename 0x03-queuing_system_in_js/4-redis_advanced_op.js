import redis from 'redis';

// create a Redis client
const client = redis.createClient();

// set up evenet handlers for the redis client
client.on('connect', () => {
    console.log("Redis client connected to the server");
});

client.on("error", () => {
    console.error(`Redis clientr not connected to the server: ${error}`);
});

// Create a hash with hset
client.hset('HolbertonSchools', 'Portland', '50', redis.print);
client.hset('HolbertonSchools', 'Seattle', '80', redis.print);
client.hset('HolbertonSchools', 'New York', '20', redis.print);
client.hset('HolbertonSchools', 'Bogota', '20', redis.print);
client.hset('HolbertonSchools', 'Cali', '40', redis.print);
client.hset('HolbertonSchools', 'Paris', '2', redis.print);


// display the hash with hgetail
client.hgetall('HolbertonSchools', (error, reply) =>{
    if (error) {
        console.error(`Error getting hash: ${error}`);
    } else {
        console.log(reply);
    }

    // close the connection 
    client.quit();
});
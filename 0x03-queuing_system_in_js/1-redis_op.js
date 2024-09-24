import redis from "redis";

const client = redis.createClient();

client.on("connect", () => {
  console.log("Redis client connected to the server");
});

client.on("error", (error) => {
  console.log(`Redis client not connected to the server: ${error}`);
});

// gracefully handle Ctrl + C (SIGINT) to close the redis connection
process.on("SIGINT", () => {
  client.quit(() => {
    console.log("Redis client disconnected from the server");
    process.exit(0);
  });
});


// function to set a new school value
function setNewSchool(schoolName, value) {
    client.set(schoolName, value, redis.print);
}

// function to display the school value
function displaySchoolValue(schoolName) {
    client.get(schoolName, (err, reply) => {
        if (err) {
            console.error(`Error getting value for ${schoolName}: ${err}`);
        }else {
            console.log(`${reply}`);
        }
    });
}

// call the functions
displaySchoolValue("Holberton");
setNewSchool("HolbertonSanFrancisco", "100");
displaySchoolValue("HolbertonSanFrancisco");
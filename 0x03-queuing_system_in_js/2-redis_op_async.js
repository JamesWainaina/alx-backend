import redis from "redis";
import {promisify} from 'util';

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


// Promisify the get function of the Redis client
const getAsync = promisify(client.get).bind(client);

// function to set a new school value
function setNewSchool(schoolName, value) {
  client.set(schoolName, value, redis.print);
}

// function to display the school value
async function displaySchoolValue(schoolName) {
  try {
    const reply = await getAsync(schoolName);
    console.log(`${reply}`);
  }catch (error){
    console.log(`Error getting value for ${schoolName}: ${error}`);
  }
}

// call the functions
displaySchoolValue("Holberton");
setNewSchool("HolbertonSanFrancisco", "100");
displaySchoolValue("HolbertonSanFrancisco");

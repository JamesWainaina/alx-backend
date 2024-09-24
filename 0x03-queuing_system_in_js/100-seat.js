const express = require("express");
const redis = require("redis");
const { promisify } = require("util");
const kue = require("kue");

const app = express();
const port = 1245;


// Create a Redis client
const client = redis.createClient();

// Promisify Redis functions
const getAsync = promisify(client.get).bind(client);
const setAsync = promisify(client.set).bind(client);

// Create a Kue queue
const queue = kue.createQueue();


const initialAvailableSeats = 50
let reservationEnabled = true;


// initialize the number of available seats
reserveSeat(initialAvailableSeats);

async function reserveSeat(number) {
    await setAsync("available_seats", number);
}

async function getCurrentAvailableSeats() {
    const seats = await getAsync("available_seats");
    return seats ? parseInt(seats) : 0;
}

// Middleware to set JSON respionse header
app.use((req, res, next) => {
    res.setHeader("Content-Type", "application/json");
    next();
});


app.get("/available_seats", async (req, res) => {
    const numberOfAvailableSeats = await getCurrentAvailableSeats();
    res.json( { numberOfAvailableSeats: numberOfAvailableSeats.toString()});
});

// Route to reserver a seat
app.get('/reserve_seat', async (req, res) => {
    if(!reservationEnabled){
        res.json({ status: "Reservation are blocked" });
        return;
    }
    const currentAvailbleSeats = await getCurrentAvailableSeats();

    if (currentAvailbleSeats <= 0) {
        res.json( { status : "Reservation are blocked" });
        return;
    }

    const job = queue.create('reserve_seat', {}).save((err) => {
        if (err) {
            res.json({ status: " Reservation failed"});
        } else {
            res.json({ status: "Reservation in progress"});
        }
    });
    job.on('complete', (result) => {
        console.log(`Seat reservation job ${job.id} completed`);
    });

    job.on('failed', (errorMessage) => {
        console.log(`Seat reservation job ${job.id} failed: ${errorMessage}`);
    });
});

// Route to process sent reservation
app.get('/process', async (req, res) => {
    res.json( { status: "Queue processing"});

    queue.process("reserve_seat", async (job, done) => {
        const currentAvailbleSeats = await getCurrentAvailableSeats();

        if (currentAvailbleSeats <= 0) {
            done(new Error("Not enough seats available"));
            reservationEnabled = false;
        } else {
            await reserveSeat(currentAvailbleSeats - 1);

            if (currentAvailbleSeats - 1 === 0) {
                reservationEnabled = false;
            }
            done();
        }
    });
});


// Start the server
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
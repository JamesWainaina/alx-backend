import kue from 'kue';

// create a kue queue
const queue = kue.createQueue();

// define the job data
const jobData = {
    phoneNumber: '1234567890',
    message: "This is a test notification message"
};

// create a job and add it to the queue
const job = queue.create('push_notification_code', jobData);


// Event handler for a successfully created job
job.on('complete', () => {
    console.log("Notification job completed");
});

// event handler for failed jobs
job.on("failed", () => {
    console.log("Notifiaction job failed");
});

// save the job to the queue
job.save((err) => {
    if (!err) {
        console.log(`Nofication job created: ${job.id}`);
    }else {
        console.error("Error creating job: ", err);
    }
    // exit the script
    process.exit(0);
})
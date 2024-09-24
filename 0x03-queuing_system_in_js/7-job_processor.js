import kue from "kue";

const blackListedNumbers = ["4153518780", "4153518781"];

// function to send notifications
function sendNotification(phoneNumber, message, job, done) {
  // track job progress
  job.progress(0, 100);

  // check if the number is blacklisted
  if (blackListedNumbers.includes(phoneNumber)) {
    // fail the job with an error
    done(new Error(`Phone number ${phoneNumber} is blacklisted`));
  } else {
    // track job progress
    job.progress(50, 100);

    // log sending notification
    console.log(
      `Sending notification to ${phoneNumber}, with message: ${message}`
    );

    // simulate sending notification
    setTimeout(() => {
      // complete the job
      done();
    }, 1000); // simulated delay for sending the notification
  }
}

// create a queue for processing jobs
const queue = kue.createQueue({
  redis: {
    host: "127.0.0.1",
    port: 6379,
  },
});

// process jobs from the push_notifacitino_code_2' queue with a cocurrency of 2
queue.process('push_notification_code_2', 2, (job, done) => {
    // Get the job data
    const { phoneNumber, message } = job.data;

    // call the sendNotification function
    sendNotification(phoneNumber, message, job, done);
});

console.log("Job processor is running...");

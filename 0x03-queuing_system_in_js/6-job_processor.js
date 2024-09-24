import kue from 'kue';


const queue = kue.createQueue();

// define the function to send notifications
function sendNotification (phoneNumber, message) {
    console.log(`Sending notification to ${phoneNumber}, with message: ${message}`);
}

// push jobs from the 'push_notification_code' queue
queue.process('push_notification_code',(job, done) => {
    const {phoneNumber, message} = job.data;
    sendNotification(phoneNumber, message);
    done();
});

console.log('Job processor is running..');
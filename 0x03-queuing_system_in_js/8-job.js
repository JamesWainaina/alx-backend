import kue from "kue";

function createPushNotificationsJobs(jobs, queue) {
    if (!Array.isArray(jobs)) {
        throw new Error("Jobs is not an array");
    }
    jobs.forEach((jobData) => {
        const job = queue.create('push_notification_code_3', jobData);

        job.on("enqueue", () => {
            console.log(`Notification job created: ${job.id}`);
        })
        .on('complete', () => {
            console.log(`Notification job ${job.id} completed`);
        })
        .on('failed', (errorMessage) => {
            console.log(`Notification job ${job.id} failed: ${errorMessage}`);
        })
        .on('progress', (progress, data) => {
            console.log(`Notication job ${job.id} ${progres}% complete`);
        });

        job.save((err) => {
            if (err) {
                console.log(`Error creating job: ${err}`);
            }
        });
    });
}

export default createPushNotificationsJobs;

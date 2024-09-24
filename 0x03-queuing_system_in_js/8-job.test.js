import kue from 'kue';
import createPushNotificationsJobs from './8-job';
import { expect } from 'chai';


const queue = kue.createQueue();

describe('createPushNotificationsJobs', () => {
    before(() => {
        // Enable kue test mode and clear the queue before runnig tests
        queue.testMode.enter();
    });

    after(() => {
        // clear the queue and exit test mode after running tests
        queue.testMode.clear();
        queue.testMode.exit();
    });

    it('should display an error message of jobs is not an array', () =>{
        try {
            createPushNotificationsJobs({}, queue);
        } catch (error) {
            // expect an error message
            expect(error.message).to.equal('Jobs is not an array');
        }
    });

    it('should create two new jobs to the queue', () => {
      const jobs = [
        {
          phoneNumber: "1234567890",
          message: "Test message 1",
        },
        {
          phoneNumber: "9876543210",
          message: "Test message 2",
        },
      ];

      createPushNotificationsJobs(jobs, queue);

      // Get all jobs from the queue
      const jobsInQueue = queue.testMode.jobs;

      // expect that two were created
      expect(jobsInQueue.length).to.equal(2);

      // Validate job data
      expect(jobsInQueue[0].type).to.equal("push_notification_code_3");
      expect(jobsInQueue[0].data).to.deep.equal(jobs[0]);
      expect(jobsInQueue[1].type).to.equal("push_notification_code_3");
      expect(jobsInQueue[1].data).to.deep.equal(jobs[1]);
    });
});
import 'dotenv/config';
import Bee from 'bee-queue';
import bqScripts from 'bee-queue/lib/lua';

import redisConfig from '../config/redis';

// Jobs
import OrderMail from '../app/jobs/OrderMail';
import CancellationMail from '../app/jobs/CancellationMail';

const jobs = [OrderMail, CancellationMail];

class Queue {
  constructor() {
    this.queues = {};
    this.init();
  }

  init() {
    jobs.forEach(({ key, handle }) => {
      this.queues[key] = {
        bee: new Bee(key, {
          redis: redisConfig,
        }),
        handle,
      };
    });
  }

  add(queue, job) {
    return this.queues[queue].bee.createJob(job).save(async (err, job) => {
      if (err) {
        console.error(`Failed creating job: ${queue}`, err);
        // ** Known error when redis has not all lua scripts loaded properly
        if (err.command === 'EVALSHA') {
          await bqScripts.buildCache(redisConfig);
          console.info('Successfully reloaded Lua scripts into cache!');
          // create job again
          // queue.createJob(config).save();
          this.queues[queue].bee.createJob(job).save();
        }
      }
    });
  }

  processQueue() {
    jobs.forEach((job) => {
      const { bee, handle } = this.queues[job.key];
      bee.on('failed', this.handleFailure).process(handle);
    });
    console.log('Load complete');
  }

  handleFailure(job, err) {
    console.log(`Queue execution: ${job.queue.name} FAILED`, err);
  }
}

export default new Queue();

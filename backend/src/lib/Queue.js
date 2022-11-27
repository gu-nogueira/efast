import 'dotenv/config';
import Bee from 'bee-queue';
import bqScripts from 'bee-queue/lib/lua';

import redis from 'redis';
import redisConfig from '../config/redis';

// Jobs
import OrderMail from '../app/jobs/OrderMail';
import OrderRetreatMail from '../app/jobs/OrderRetreatMail';
import OrderFinishMail from '../app/jobs/OrderFinishMail';
// import OrderProblemMail from '../app/jobs/OrderProblemMail';
import CancellationMail from '../app/jobs/CancellationMail';

const jobs = [OrderMail, OrderRetreatMail, OrderFinishMail, CancellationMail];

class Queue {
  constructor() {
    this.redisClient = {};
    this.queues = {};
    this.init();
  }

  init() {
    this.redisClient = redis.createClient({
      host: redisConfig.host,
      port: redisConfig.port,
      db: 0,
      options: {},
      retry_strategy: (options) => {
        if (options.error && options.error.code === 'ECONNREFUSED') {
          // End reconnecting on a specific error and flush all commands with a individual error
          console.error('The server refused the connection');
        }
        if (options.total_retry_time > 1000 * 60 * 60) {
          // End reconnecting after a specific timeout and flush all commands with a individual error
          console.error('Retry time exhausted');
        }
        // if (options.attempt > 10) {
        //   // End reconnecting with built in error
        //   return undefined;
        // }
        // reconnect after
        return Math.min(options.attempt * 100, 3000);
      },
    });
    this.redisClient.on('end', () => {
      console.log('Redis connection ended');
      this.remove();
    });
    this.redisClient.on('error', (err) => {
      console.error('Redis error', err);
    });
    this.redisClient.on('connect', () => {
      console.log('Redis connected successfully');
      this.create();
    });
  }

  create() {
    jobs.forEach(({ key, handle }) => {
      this.queues[key] = {
        bee: new Bee(key, {
          redis: this.redisClient,
          isWorker: true,
          activateDelayedJobs: true,
          removeOnSuccess: true,
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

  remove() {
    jobs.forEach((job) => {
      const { bee } = this.queues[job.key];
      bee.close();
    });
  }

  isReady() {
    return this.redisClient.connected;
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

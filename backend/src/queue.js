console.log('Loading queues...');
import Queue from './lib/Queue';

process.on('uncaughtException', (err) => {
  console.error(err);
});

Queue.processQueue();

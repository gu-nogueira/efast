console.log('Loading queues...');
import Queue from './lib/Queue';

process.on('uncaughtException', (err) => {
  console.error(err);
});

async function queueConnectionPromise() {
  return new Promise((resolve) => {
    const interval = setInterval(() => {
      console.log('Waiting for redis to connect...');

      if (Queue.isReady()) {
        console.log('Queue connection is ready');
        clearInterval(interval);
        resolve();
      }
    }, 3000);
  });
}

queueConnectionPromise().then(() => {
  Queue.processQueue();
});

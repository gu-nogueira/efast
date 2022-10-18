console.time('Load time');
console.log('Loading app...');

import app from './app';

app.listen(process.env.APP_PORT || 2000);
console.log(`Server is listening in: ${process.env.APP_URL}`);

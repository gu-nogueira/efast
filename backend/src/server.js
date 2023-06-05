console.time('Load time');
console.log('Loading app...');

import app from './app';

app.listen(process.env.APP_PORT || 80);
console.log(`Server is listening in port ${process.env.APP_PORT || 80}!`);

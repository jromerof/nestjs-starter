import { randomBytes } from 'crypto';

console.log('Generate these secrets and add to your .env file:\n');
console.log(`OAUTH_STATE_SECRET=${randomBytes(32).toString('hex')}`);
console.log(`JWT_SECRET=${randomBytes(32).toString('hex')}`);
console.log(`COOKIE_SECRET=${randomBytes(32).toString('hex')}`);
const crypto = require('crypto');

crypto.randomBytes(64, (err, buffer) => {
    if (err) throw err;
    const secret = buffer.toString('hex');
    console.log(`Your session secret: ${secret}`)
});

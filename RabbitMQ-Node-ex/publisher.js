const ampq = require('amqplib/callback_api');

ampq.connect('amqp://localhost', (err, conn) => {
    if (err) {
        throw err;
    }

    conn.createChannel((error, channel) => {
        if (error) {
            throw error;
        }
        let queue = 'sample';
        let msg = 'Sample message';
        channel.assertQueue(queue, {
            durable: false
        });

        channel.sendToQueue(queue, Buffer.from(msg));
        console.log(`Message : ${msg}`)
        setTimeout(() => conn.close(), 1000);
    })
})
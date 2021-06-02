/*
#sample#
let sse = new EventSource("http://localhost:8888/stream");
sse.onmessage = console.log

let client = new WebSocket('ws://localhost:8888');
client.onopen = function(msg) {
	client.send(msg);
}
client.onmessage = function(evt) {
    var msg = evt.data;
    console.log(`Received Msg...${msg}`);
};

*/

const app = require("express")();
const WebSocket = require('ws');

const port = process.argv[2] || process.env.PORT || 8888;
const serverName = process.env.SERVER_NAME || "sample";

const wss = new WebSocket.Server({ noServer: true });
wss.on('connection', (ws) => {

    //connection is up, let's add a simple simple event
    ws.on('message', (message) => {

        //log the received message and send it back to the client
        console.log('received: %s', message);
        ws.send(`Random Msg-> ${port}`);
        ws.send(`Sending Msg-> ${message}`);
    });

    //send immediatly a feedback to the incoming connection    
    ws.send('Hi there, I am a WebSocket server');
});

app.get("/", (req, res) => res.send(`Hello ${port}`));

app.get("/stream", (req, res) => {

    res.setHeader("Content-Type", "text/event-stream");
    send(res);

})

let i = 0;

function send(res) {

    res.write("data: " + `hello from ${serverName} ---- [${i++}]\n\n`);


    setTimeout(() => send(res), 1000);
}

const server = app.listen(port);

server.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, socket => {
    wss.emit('connection', socket, request);
  });
});

console.log(`Listening on ${port}`)

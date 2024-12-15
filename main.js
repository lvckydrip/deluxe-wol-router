const http = require('http');
const dgram = require('dgram');

const port = 187;

function wakeUp(code) {
    if (code.toString().startsWith("wol:"))
    {
        const macAddress = code.toString().split(":")[1];
        const socket = dgram.createSocket('udp4');

        socket.bind(() => {
            socket.setBroadcast(true);
        });

        let magicPacket = Buffer.alloc(102);

        magicPacket.write("ffffffffffff" + macAddress.repeat(16), 0, "hex");
        console.log(magicPacket);
        console.log(("ffffffffffff" + macAddress.repeat(16)).length);

        const broadcastAddress = '255.255.255.255';
        const port = 7;

        socket.send(magicPacket, 0, magicPacket.length, port, broadcastAddress, (err) => {
            if (err) {
                console.error('Error sending message:', err);
            } else {
                console.log('Message sent to broadcast address');
            }
            socket.close();
        });
    }
}

const server = http.createServer((req, res) => {
    if (req.method === 'POST' && req.url === '/') {
        let body = '';

        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            console.log('Received POST request:', body);
            wakeUp(body)
            res.writeHead (200, { 'Content-Type': 'text/plain' });
            res.end('POST request received!');
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
});

server.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});

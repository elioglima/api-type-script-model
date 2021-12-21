import './env';
import debug from 'debug';
import Server from './config/webserver/server';
import { createConnection } from 'typeorm';

const logger = debug('service-api:http');

const server: Server = new Server();

const port: string | number | false = normalizePort(process.env.PORT || '3000');
const http = server.createHTTP(port);
http.listen(port);
http.on('error', onError);
http.on('listening', onListening);
instantiateConnection().then(() => logger('Connection created'));

function normalizePort(val: string) {
    const port = parseInt(val, 10);

    if (isNaN(port)) {
        return val;
    }

    if (port >= 0) {
        return port;
    }

    return false;
}

/**
 * Event listener for HTTP server "error" event.
 */
function onError(error: any) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    var bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */
 function onListening() {
    const addr = http.address();
    const bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr;
    logger('Listening on ' + bind);
}

async function instantiateConnection() {
    await createConnection().then(connection => {
        connection.logger.log('info', 'Connection created');
    }, onError);
}

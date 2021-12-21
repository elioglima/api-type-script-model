import compression from 'compression'
import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import http from 'http'
import routes from './routes'
import morgan from 'morgan'

class Server {
    private readonly server: express.Express;

    constructor() {
        this.server = express()

        this.server.use(morgan('dev'))
        this.server.use(express.json())
        this.server.use(express.urlencoded({ extended: false }))
        this.server.use(compression())
        this.server.use(helmet())

        this.server.use(cors())

        this.server.use(routes)
    }

    public createHTTP(port: string | number | false) {
        this.server.set('port', port)
        return http.createServer(this.server);
    }
}

export default Server;

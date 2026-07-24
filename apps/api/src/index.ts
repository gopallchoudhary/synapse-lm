import http from 'node:http'
import { app as expressApplication } from './server'
import { env } from './env';


function init() {
    try {
        const server = http.createServer(expressApplication)
        const PORT = env.PORT ? +env.PORT : 8000

        server.listen(PORT, () => {
            console.log(`http server is running on port ${PORT}`)
        })

    } catch (error) {
        console.error(`Error creating http server`, { error });
        process.exit(1);
    }
}

init()
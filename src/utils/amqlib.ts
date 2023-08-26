import amqplib from 'amqplib'
import { Env } from '../common/schema/app.schema'

async function createConnection() {
    const connection = await amqplib.connect(Env.AMQ_URL)
    const channel = await connection.createChannel()

    return channel
}

export default createConnection()
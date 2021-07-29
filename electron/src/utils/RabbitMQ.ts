import { Connection, Channel, connect, Message } from 'amqplib'
require('../../../bootstrap')

class RabbitServer {
  private conn: Connection
  private channel: Channel

  // eslint-disable-next-line no-useless-constructor
  constructor(private uri: string) {}

  async start(): Promise<void> {
    try {
      if (!this.conn || !this.channel) {
        this.conn = await connect(this.uri)
        this.channel = await this.conn.createChannel()
        console.log('Rabbit queues has connected')
      }
    } catch (error) {
      console.log({ message: 'Failed to start rabbit queues.', error })
    }
  }

  async publishInQueue(queue: string, message: string): Promise<void> {
    await this.start()
    this.channel.sendToQueue(queue, Buffer.from(message))
  }

  async publishInExchange(
    exchange: string,
    routingKey: string,
    message: string
  ): Promise<boolean> {
    await this.start()
    return this.channel.publish(exchange, routingKey, Buffer.from(message))
  }

  async consume(
    queue: string,
    callback: (message: Message) => void
  ): Promise<void> {
    await this.start()
    this.channel.consume(queue, (message) => {
      callback(message)
      this.channel.ack(message)
    })
  }
}

export default new RabbitServer(process.env.RABBIT_SERVER)

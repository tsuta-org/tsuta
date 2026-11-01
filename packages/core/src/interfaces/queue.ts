export interface QueueMessage<T = unknown> {
  id: string
  body: T
}

export interface Queue<T = unknown> {
  send(message: T): Promise<void>
  sendBatch(messages: T[]): Promise<void>
}

export interface QueueConsumer<T = unknown> {
  consume(handler: (message: QueueMessage<T>) => Promise<void>): Promise<void>
}

export interface QueueAdapter {
  createQueue<T = unknown>(config: any): Queue<T>
  createConsumer<T = unknown>(config: any): QueueConsumer<T>
}

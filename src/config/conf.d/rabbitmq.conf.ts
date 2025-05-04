/**
 * RabbitMQ configuration file.
 * @module rabbitmq.conf
 * @description This file contains the configuration for RabbitMQ.
 * It exports an object with the following properties:
 * - urls: The RabbitMQ URLs to connect to.
 * - queue: The name of the queue to use.
 * - exchange: The name of the exchange to use.
 * - prefetchCount: The number of messages to prefetch.
 * - persistent: Whether to use persistent messages.
 * - socketOptions: The options for the socket connection.
 * - isGlobalPrefetchCount: Whether to use global prefetch count.
 * - retryAttempts: The number of retry attempts for failed messages.
 * - retryDelay: The delay between retry attempts.
 * - messageTtl: The time-to-live for messages in the queue.
 * - queueOptions: The options for the queue.
 * - queueName: The name of the queue to use.
 * - queueDurable: Whether to use durable queues.
 */
export default {
  urls: process.env.RABBITMQ_URLS ? process.env.RABBITMQ_URLS.split(',') : ['amqp://localhost:5672'],
  queue: process.env.RABBITMQ_QUEUE || 'default_queue',
  exchange: 'onesleek.fanout',
  prefetchCount: 1,
  persistent: true,
  socketOptions: {
    heartbeatIntervalInSeconds: 60,
    reconnectTimeInSeconds: 5,
  },
  isGlobalPrefetchCount: true,
  retryAttempts: 5,
  retryDelay: 3000,
  messageTtl: 15000,
  queueOptions: {
    durable: process.env.RABBITMQ_QUEUE_DURABLE === 'true' || true,
  },
};

import dotenv from 'dotenv';
dotenv.config();
import { createApp } from './app';
import { logger } from './utils/logger';
import * as z from 'zod';

process.on('SIGINT', function () {
  logger.info('>>> SIGINT');
  process.exit();
});

process.on('uncaughtException', async (err, origin) => {
  logger.error(err, '>>> uncaughtException');
  process.exit(1);
});

process.on('unhandledRejection', async (reason, promise) => {
  logger.error('>>> unhandledRejection', {
    reason,
  });
  process.exit(1);
});

const envSchema = z.object({
  PORT: z.coerce.number().int().min(1).max(65535),
  HOST: z.string(),
});

const { PORT, HOST } = envSchema.parse(process.env);

const IS_PM2 = !!process.env.pm_id;
logger.info(`IS PM2=${IS_PM2.toString()}`);

function startApp(app) {
  return new Promise((resolve, reject) => {
    app.listen(PORT, HOST).once('listening', resolve).once('error', reject);
  });
}

async function start() {
  const app = await createApp();
  await startApp(app);
}

start()
  .then(() => {
    logger.info(`app is running at http://${HOST}:${PORT}`);
  })
  .catch((err) => {
    logger.error(err, 'could not start the application');
  });

import fs from 'fs';
import fsPromises from 'fs/promises';
import express, { Express } from 'express';
import path from 'path';
import pinoHTTP from 'pino-http';
import { logger } from './utils/logger';
const id = process.pid;

const leakyArray: string[] = [];

export const createApp = async (): Promise<Express> => {
  const app = express();
  // uncomment the line below to enable pino-http
  // app.use(pinoHTTP({ logger }));

  app.use(express.static(path.join(__dirname, 'public')));

  app.get('/api', async (req, res) => {
    res.json({ id });
  });

  app.get('/api/boom/async', async (req, res) => {
    await fsPromises.readFile('non-existent-file');
    return res.status(200);
  });

  app.get('/api/boom/sync', (req, res) => {
    fs.readFileSync('non-existent-file');
    return res.status(200);
  });

  app.get('/api/exit', (req, res) => {
    process.exit(1);
  });

  app.get('/api/memory-leak', (req, res) => {
    leakyArray.push(new Array(1000000).join('*'));
    return res.json({ length: leakyArray.length });
  });

  return app;
};

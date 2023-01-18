# PM2 Node.js Examples

This repository contains examples of using [PM2](https://pm2.keymetrics.io/) to run (and crash) Node.js apps.

## Prerequisites

You'll need Node and Docker, to run via docker-compose.

## Getting Started

Install dependencies using npm, yarm or pnpm then run the application.

```bash
npm build
```

## Check env

Configure the PORT and HOST in the [.env](.env) file, which is currently set to

```env
PORT=5000
HOST=0.0.0.0
```

## Running

Start pm2

```bash
docker-compose up
```

## Crash the app

You can cause the app to crash with an unhandled rejection by visiting [http://localhost:5000/api/boom/async](http://localhost:5000/api/boom/async).

## Running PM2 commands

```bash
docker exec -it pm2-nodejs-examples-pm2_api-1 sh
```

now you can run pm2 commands like the one below

```bash
pm2 list
```

## Memory leak

You can configure memory limits in [pm2.json](pm2.json) by setting a value for `max_memory_restart`.

Running the command below will cause a memory leak causing PM2 to restart the application when it reaches the memory limit.

```bash
node load-test.js
```

If you want to see the memory usage of the application you can run the command below

```bash
pm2 monit
```

> Each time a process run by PM2 reaches the memory limit, it will be restarted triggering a SIGINT.

## Manually triggering a SIGINT

Start by listing the process ids that pm2 is running

```bash
pm2 list
```

now pick a process id and trigger a sigint

```bash
kill -SIGINT <pid>
```


import dotenv from 'dotenv';
dotenv.config();

import { TaskServiceConnectionType } from '../src/model/task';
import { Config, Environment } from './types';
import { getEnv } from './utils';


const environment = getEnv('NODE_ENV');

if (!Object.values(Environment).includes(environment as Environment)) {
    process.exit(1);
}

const connectionType = getEnv('CONNECTION_TYPE') as TaskServiceConnectionType;
const connectionString = getEnv('CONNECTION_STRING');

let config: Config = {
    environment: environment || "development",
    port: process.env.PORT ? Number(process.env.PORT) : 5000,
    connection: { connectionType: connectionType, connectionString: connectionString },
}

export default config;
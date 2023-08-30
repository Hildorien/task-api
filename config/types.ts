import { TaskServiceConnection } from "../src/model/task";

export interface Config {
	environment: string;
	port?: number;
    connection: TaskServiceConnection;
}

export enum Environment {
	LOCAL = 'local',
	DEVELOPMENT = 'development',
	STAGING = 'staging',
	PRODUCTION = 'production',
}
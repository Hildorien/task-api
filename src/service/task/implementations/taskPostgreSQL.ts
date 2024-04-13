import * as pg from 'pg';
import { ITaskConnection } from './taskInterface';
import { Task } from '../../../model/task';

export class TaskServicePostgreSQL implements ITaskConnection {
    private pool: pg.Pool;

    private constructor(connectionString: string) {
        this.pool = new pg.Pool({
            connectionString: connectionString,
        });
        this.initializeDatabase();
    }

    private async initializeDatabase(): Promise<void> {
        const client = await this.pool.connect();
        try { 
            this.ifTasksExist(client).then(async exists => {
                if (!exists) {
                    await this.createTasks(client);
                }
            });
        } catch (error) {
            console.error(error);
        }
         finally {
            client.release();
        }
    }

    private async ifTasksExist(client: any) {
        // Check if the "tasks" table exists in the database.
        const result = await client.query(`
        SELECT EXISTS (
            SELECT 1
            FROM information_schema.tables
            WHERE table_name = 'tasks'
        )
        `);
        return result.rows[0].exists;
    }

    private async createTasks(client: any) {
        await client.query(`
                    CREATE TABLE tasks (
                        id SERIAL PRIMARY KEY,
                        title VARCHAR(255) NOT NULL,
                        description TEXT
                    )
                `);
    }

    public static async create(connectionString: string): Promise<ITaskConnection> {
        return Promise.resolve(new TaskServicePostgreSQL(connectionString));
    }

    async getAllTasks(): Promise<Task[]> {
        const client = await this.pool.connect();
        try {
            const result = await client.query('SELECT * FROM tasks');
            return result.rows as Task[];
        } finally {
            client.release();
        }
    }

    async getTaskById(id: number): Promise<Task | undefined> {
        const client = await this.pool.connect();
        try {
            const result = await client.query('SELECT * FROM tasks WHERE id = $1', [id]);
            if (result.rows.length === 0) {
                return undefined;
            }
            return result.rows[0] as Task;
        } finally {
            client.release();
        }
    }

    async createTask(newTask: Task): Promise<void> {
        const client = await this.pool.connect();
        try {
            await client.query('INSERT INTO tasks (title, description) VALUES ($1, $2)', [newTask.title, newTask.description]);
        } finally {
            client.release();
        }
    }

    async updateTask(updatedTask: Task): Promise<void> {
        const client = await this.pool.connect();
        try {
            await client.query('UPDATE tasks SET title = $1, description = $2 WHERE id = $3', [updatedTask.title, updatedTask.description, updatedTask.id]);
        } finally {
            client.release();
        }
    }

    async deleteTask(id: number): Promise<void> {
        const client = await this.pool.connect();
        try {
            await client.query('DELETE FROM tasks WHERE id = $1', [id]);
        } finally {
            client.release();
        }
    }

    async deleteAllTasks(): Promise<void> {
        const client = await this.pool.connect();
        try {
            await client.query('DELETE FROM tasks');
        } finally {
            client.release();
        }
    }
}

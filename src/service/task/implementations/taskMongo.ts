import { Task } from "../../../model/task";
import { MongoClient, Collection, Db } from "mongodb";
import { ITaskConnection } from "./taskInterface";


export class TaskServiceMongo implements ITaskConnection {

    private db: Db;
    private tasks: Collection<Task>;

    private constructor(db: Db) {
        this.db = db;
        this.tasks = this.db.collection<Task>("tasks");
    }

    public static async create(connectionString: string): Promise<ITaskConnection> {
        // ====================================
        // Wait for mongo service to start when running the app in a dockerize container before initilizing a connection
        const wait = new Promise(r => setTimeout(r, 3000));
        await wait;
        // ====================================
        const client = await MongoClient.connect(connectionString);
        const db = client.db("taskapp");
        return new TaskServiceMongo(db);
    }

    async getAllTasks(): Promise<Task[]> {
        return await this.tasks.find().toArray();
    }

    async getTaskById(id: number): Promise<Task> {
        return await this.tasks.findOne({ id: id });
    }

    async createTask(newTask: Task): Promise<void> {
        await this.tasks.insertOne(newTask);
    }

    async updateTask(updatedTask: Task): Promise<void> {
        await this.tasks.updateOne({ id: updatedTask.id }, { $set: updatedTask });
    }

    async deleteTask(id: number): Promise<void> {
        const task = await this.tasks.findOne({ id: id });
        if (!task) {
            throw new Error("TASK_NOT_FOUND");
        }
        await this.tasks.deleteOne({ id: id });
    }

    async deleteAllTasks(): Promise<void> {
        await this.tasks.deleteMany({});
    }

}
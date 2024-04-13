import { Task, TaskServiceConnection, TaskServiceConnectionType } from "../../model/task";
import { TaskServiceFile } from "./implementations/taskFile";
import { ITaskConnection } from "./implementations/taskInterface";
import { TaskServiceMongo } from "./implementations/taskMongo";
import { TaskServicePostgreSQL } from "./implementations/taskPostgreSQL";

export class TaskService  {
    
    private static instance: ITaskConnection;

    public static getInstance(): ITaskConnection {
        return this.instance;
    }
    
    public static async initialize(conn: TaskServiceConnection) {
        if (!this.instance) {
           switch (conn.connectionType) {
               case TaskServiceConnectionType.LOCALFILE:
                   this.instance = await TaskServiceFile.create(conn.connectionString);
                   break;
               case TaskServiceConnectionType.MONGO:
                   this.instance = await TaskServiceMongo.create(conn.connectionString);
                   break;
                case TaskServiceConnectionType.POSTGRESQL:
                    this.instance = await TaskServicePostgreSQL.create(conn.connectionString);
                    break;
               default:
                   throw new Error("Task Service ConnectionType not supported");
           }
        }
    }
}
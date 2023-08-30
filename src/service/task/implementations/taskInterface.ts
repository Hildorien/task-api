import { Task } from "../../../model/task";

export interface ITaskConnection {
    getAllTasks(): Promise<Task[]>;
    getTaskById(id: number): Promise<Task | undefined>;
    createTask(newTask: Task): void;
    updateTask(updatedTask: Task): void;
    deleteTask(id: number): void;
    deleteAllTasks(): void;
}
import { TaskService } from "..";
import { Task } from "../../../model/task";
import * as fs from "fs";
import { ITaskConnection } from "./taskInterface";

export class TaskServiceFile implements ITaskConnection  {

  private filePath = "";
  private tasks: Task[] = [];

  private constructor(filePath: string) {
    this.filePath = filePath;
    this.loadTasks();
  }
  
  public static async create(connectionString: string): Promise<ITaskConnection> {
    return Promise.resolve(new TaskServiceFile(connectionString));
  }

  private async loadTasks() {
    try {
      const fileContent = fs.readFileSync(this.filePath, "utf8");
      this.tasks = JSON.parse(fileContent);
    } catch (error) {
      this.tasks = [];
    }
  }

  private saveTasks() {
    fs.writeFileSync(
      this.filePath,
      JSON.stringify(this.tasks, null, 2),
      "utf8",
    );
  }

  async getAllTasks(): Promise<Task[]> {
    return this.tasks;
  }

  async getTaskById(id: number): Promise<Task | undefined> {
    return this.tasks.find(task => task.id === id);
  }

  createTask(newTask: Task): void {
    if (this.tasks.findIndex((task) => task.id === newTask.id) !== -1) {
      throw new Error("Task already exists");
    }
    this.tasks.push({ id: this.tasks.length + 1, ...newTask });
    this.saveTasks();
  }

  updateTask(updatedTask: Task): void {
    const index = this.tasks.findIndex((task) => task.id === updatedTask.id);
    if (index !== -1) {
      this.tasks[index] = updatedTask;
      this.saveTasks();
    } else {
      throw new Error("Task not found");
    }
  }

  deleteTask(id: number): void {
    const index = this.tasks.findIndex((task) => task.id === id);
    if (index !== -1) {
      this.tasks.splice(index, 1);
      this.saveTasks();
    } else {
      throw new Error("Task not found");
    }
  }

  deleteAllTasks(): void {
    this.tasks = [];
    this.saveTasks();
  }
}

export type Task = {
  id?: number;
  title: string;
  description: string;
  completed: boolean;
};

export enum TaskServiceConnectionType {
    LOCALFILE = "localfile",
    MONGO = "mongo",
    POSTGRESQL = "postgresql"
}

export type TaskServiceConnection = {
  connectionType: TaskServiceConnectionType;
  connectionString: string;
}
import { Task, TaskServiceConnectionType } from "../../model/task";
import { TaskService } from "../../service/task";

const initializeTestSuite = async () => {
  await TaskService.initialize(
    { connectionType: TaskServiceConnectionType.LOCALFILE, 
      connectionString: "/home/nacho/TestProjects/tasks-app/src/tests/unit/tasks.json",  
    }
  );
};

const dbTearDown = async () => {
  await TaskService.getInstance().deleteAllTasks();
};

describe("Task Operations", () => {
    beforeAll(async () => {
      await initializeTestSuite();
      await dbTearDown();
    });
    afterAll(async () => {
      await dbTearDown();
    }); 
    it("task on initialize should be empty", async () => {
      const tasks = await TaskService.getInstance().getAllTasks();

      expect(tasks).toHaveLength(0);
    });

    it('should create a new task', async () => {
        const initialTasks: Task[] = [];
        const newTask = { id: 1, title: 'New Task', description: 'Test Description', completed: false };
        await TaskService.getInstance().createTask(newTask);
        const updatedTasks = await TaskService.getInstance().getAllTasks();

        expect(updatedTasks).toHaveLength(initialTasks.length + 1);
        expect(updatedTasks).toContainEqual(newTask);
    });

    it('should not add same task', async () => {
        const newTask = { id: 1, title: 'New Task', description: 'Test Description', completed: false };
        try {
          await TaskService.getInstance().createTask(newTask);
        } catch(error) {
            expect(error.message).toEqual('Task already exists');
        }
    });

    it('should update a task', async () => {  
        const taskBeforeUpdate = await TaskService.getInstance().getTaskById(1);
        taskBeforeUpdate.completed = true;
        TaskService.getInstance().updateTask(taskBeforeUpdate);
        const taskAfterUpdate = await TaskService.getInstance().getTaskById(1);

        expect(taskAfterUpdate.completed).toBeTruthy(); 
    });

    it('should delete a task', async () => { 
      TaskService.getInstance().deleteTask(1);
      const tasks = await TaskService.getInstance().getAllTasks();
      expect(tasks).toHaveLength(0);
    });

    it('task not found', async () => {
        const task = await TaskService.getInstance().getTaskById(1);
        expect(task).toBeUndefined();

        try { 
            await TaskService.getInstance().updateTask({ id: 1, title: 'New Task', description: 'Test Description', completed: false });
        } catch(error) {    
            expect(error.message).toEqual('Task not found');
        }

        try { 
            await TaskService.getInstance().deleteTask(1);
        } catch(error) {    
            expect(error.message).toEqual('Task not found');
        }

    });

});

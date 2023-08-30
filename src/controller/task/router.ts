import { Request, Response, Router } from "express";
import { StatusCodes } from "http-status-codes";
import { Task } from "../../model/task";
import { HttpError } from "../../model/error";
import { BadRequestResponse, ServerErrorResponse } from "../../utils/httpResponses";
import { TaskService } from "../../service/task";

let router = Router({ mergeParams: true });

/**
 * Get Tasks
 */
router.get("", async (req: Request, res: Response, next: Function) => {
  try {
    const response = await TaskService.getInstance().getAllTasks();
    return res.status(StatusCodes.OK).json(response);
  } catch (error: any) {
    return ServerErrorResponse(res, error);
  }
});

/**
 * Get Task by ID
 */
router.get("/:taskId", async (req: Request, res: Response, next: Function) => {
  try {
    if (!req.params.taskId) {
      return BadRequestResponse(res);
    }

    const taskId = parseInt(req.params.taskId);

    if (isNaN(taskId)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        code: StatusCodes.BAD_REQUEST,
        reason: "INVALID_TASK_ID",
      });
    }

    const task = await TaskService.getInstance().getTaskById(taskId);
    if (!task) {
      return res.status(StatusCodes.NOT_FOUND).json({
        code: StatusCodes.NOT_FOUND,
        reason: "TASK_NOT_FOUND",
      });
    }

    return res.status(StatusCodes.OK).json(task);
  } catch (error: any) {
    return ServerErrorResponse(res, error);
  }
});

/**
 * Create a new Task
 */
router.post("", async (req: Request, res: Response, next: Function) => {
  try {
    const task = req.body as Task;

    if (!task) {
      throw new HttpError(`No task provided`, StatusCodes.BAD_REQUEST);
    }

    await TaskService.getInstance().createTask(task);

    return res.status(StatusCodes.CREATED).send();
  } catch (error: any) {
    return ServerErrorResponse(res, error);
  }
});

/**
 * Edit an existing Task
 */
router.put("/:taskId", async (req: Request, res: Response, next: Function) => {
  try {
    if (!req.params.taskId) {
      return BadRequestResponse(res);
    }

    const taskId = parseInt(req.params.taskId);

    if (isNaN(taskId)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        code: StatusCodes.BAD_REQUEST,
        reason: "INVALID_TASK_ID",
      });
    }

    const taskToEdit = await TaskService.getInstance().getTaskById(taskId);

    if (!taskToEdit) {
      return res.status(StatusCodes.NOT_FOUND).json({
        code: StatusCodes.NOT_FOUND,
        reason: "TASK_NOT_FOUND",
      });
    }

    taskToEdit.completed = !taskToEdit.completed;

    await TaskService.getInstance().updateTask(taskToEdit);

    return res.status(StatusCodes.OK).send(taskToEdit);
  } catch (error: any) {
    return ServerErrorResponse(res, error);
  }
});

/**
 * Delete a Task
 */
router.delete(
  "/:taskId",
  async (req: Request, res: Response, next: Function) => {
    try {
      if (!req.params.taskId) {
        return BadRequestResponse(res);
      }

      const taskId = parseInt(req.params.taskId);

      if (isNaN(taskId)) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          code: StatusCodes.BAD_REQUEST,
          reason: "INVALID_TASK_ID",
        });
      }
      await TaskService.getInstance().deleteTask(taskId);

      return res.status(StatusCodes.OK).send();
    } catch (error: any) {
      return ServerErrorResponse(res, error);
    }
  },
);

export default router;

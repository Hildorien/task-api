import { Request, Response, Router } from "express";
import { StatusCodes } from "http-status-codes";
import taskRouter from "./task/router";
import { handleError } from "./middleware/error";

export let router = Router();

// Mapping routes

/**
 * Health route for all methods
 */
router.all("/health", async (req: Request, res: Response, next: Function) => {
  return res.status(StatusCodes.OK).send();
});

//Route for Tasks
router.use("/tasks", taskRouter);

/**
 * CORS Options route
 */
router.options('*', function (req: Request, res: Response) {
	const origin = req.headers.origin;
	res.setHeader('Access-Control-Allow-Origin', origin || '*');
	res.header('Access-Control-Allow-Credentials', 'true');
	res.header('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT');
	res.header('Content-Type', 'application/json');
	res.header(
		'Access-Control-Allow-Headers',
		'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers'
	);
	return res.send();
});

//Handle errors with a HttpError custom class
router.use(handleError);

//In any case a route does not match
router.all("*", function (req: Request, res: Response) {
  res.status(StatusCodes.NOT_FOUND).json({ message: "Endpoint not found" });
});

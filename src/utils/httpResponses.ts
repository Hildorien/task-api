import { Response } from "express";
import { StatusCodes } from "http-status-codes";

export function ServerErrorResponse(res: Response, error: any) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        code: StatusCodes.INTERNAL_SERVER_ERROR,
        reason: error.message || error,
      });
}

export function BadRequestResponse(res: Response) {
    return res.status(StatusCodes.BAD_REQUEST).json({
        code: StatusCodes.BAD_REQUEST,
        reason: "INVALID_DATA",
      });
}

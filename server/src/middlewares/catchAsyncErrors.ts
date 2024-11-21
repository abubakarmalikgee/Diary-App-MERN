import { Request, Response, NextFunction } from "express";

const asyncHandler = (
  theFunc: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(theFunc(req, res, next)).catch(next);
  };
};

export default asyncHandler;

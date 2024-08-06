import { Request, Response, NextFunction } from 'express';
import { MongoServerError } from 'mongodb';

const errorHandler = (err: Error | MongoServerError, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof MongoServerError && err.code === 11000) {
        // Duplicate key error
        return res.status(400).json({
            success: false,
            message: 'Duplicate key error: An account with this email already exists.'
        });
    }

    res.status(500).json({
        success: false,
        message: err.message || 'Something went wrong'
    });
};

export default errorHandler;

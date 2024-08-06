// controllers/authController.ts
import { Request, Response } from 'express';
import authService from "../../services/authService";
import { IUser } from '../../models/auth/user';
import authResource from "../../resources/authResource";

const register = async (req: Request, res: Response) => {
    try {
        const user = await authService.register(req.body);
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'An error occurred', error });
    }
}

const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const ipAddress = req.ip || '0.0.0.0';
        const { user, accessToken, refreshToken } = await authService.login(email, password, ipAddress);
        res.json({
            message: 'Login successful',
            user: authResource.transform(user),
            accessToken,
            refreshToken
        });
    } catch (error) {
        res.status(500).json({ message: 'An error occurred', error });
    }
}


const refreshToken = async(req: Request, res: Response) =>  {
    try {
        const { token } = req.body;
        const ipAddress = req.ip || '0.0.0.0';
        const { accessToken, refreshToken } = await authService.refreshAccessToken(token, ipAddress);
        res.json({
            accessToken,
            refreshToken
        });
    } catch (err) {
        res.status(500).json({ message: 'An error occurred', err });
    }
}



export default {
    register,
    login,
    refreshToken,
};

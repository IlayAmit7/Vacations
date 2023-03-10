import express, { Request, Response, NextFunction } from "express";
import CredentialsModel from "../4-models/credentials-model";
import UserModel from "../4-models/user-model";
import authLogic from "../5-services/auth-service";

//* Take only the router mechanism from express:
const router = express.Router();

//* POST http://localhost:3001/api/auth/register
router.post(
    "/api/auth/register",
    async (request: Request, response: Response, next: NextFunction) => {
      try {
        const user = new UserModel(request.body);
        const token = await authLogic.register(user);
        response.status(201).json(token); // status: 201 - Created
      } catch (err: any) {
        next(err); // Jumping to catchAll middleware
      }
    }
  );

//* POST http://localhost:3001/api/auth/login
router.post(
    "/api/auth/login",
    async (request: Request, response: Response, next: NextFunction) => {
      try {
        const credentials = new CredentialsModel(request.body);
        const token = await authLogic.login(credentials);
        response.json(token);
      } catch (err: any) {
        next(err); // Jumping to catchAll middleware
      }
    }
  );

//* GET http://localhost:3001/api/auth/:email
router.get("/api/auth/:email", async (request: Request, response: Response, next: NextFunction) => {
    try {
        const email = request.params.email;
        const exists = await authLogic.emailIsTaken(email);
        response.json(exists);
    }
    catch (err: any) {
        next(err);
    }
});

export default router;
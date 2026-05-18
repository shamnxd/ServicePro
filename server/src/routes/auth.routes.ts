import { Router } from "express";
import { AuthController } from "../controllers/AuthController";
import { validateDto } from "../middleware/dto.middleware";
import { LoginRequestSchema } from "../dtos/auth.dto";

const router = Router();
const authController = new AuthController(); // Instantiated, will autoInject dependencies

router.post("/login", validateDto(LoginRequestSchema), authController.login);
router.post("/refresh", authController.refresh);
router.post("/logout", authController.logout);

export const authRouter = router;

import { Router } from "express";
import { SMRController } from "../controllers/SMRController";
import { requireAuth } from "../middleware/auth.middleware";
import { validateDto } from "../middleware/dto.middleware";
import { CreateSMRSchema, UpdateSMRSchema } from "../dtos/smr.dto";

const router = Router();
const controller = new SMRController();

// Require auth for all SMR endpoints
router.use(requireAuth);

router.post("/", validateDto(CreateSMRSchema), controller.create);
router.get("/by-complaint", controller.getByComplaintId);
router.get("/:id", controller.getById);
router.put("/:id", validateDto(UpdateSMRSchema), controller.update);
router.post("/:id/approve", controller.approve);

export const smrRouter = router;

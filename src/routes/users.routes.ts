import express from "express";
import { validateBody } from "../middlewares/validateBody.js";
import { createUserSchema, updateUserSchema} from "../validators/user.validator.js";
import { findById, update} from "../controllers/user.controller.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { upload }  from "../middlewares/upload.middleware.js"; 

const router = express.Router();

router.get("/:id", authMiddleware, findById);
router.put("/upload/:id", authMiddleware, upload.single("file"), validateBody(updateUserSchema), update);

// router.post("/", validateBody(createUserSchema), createUser);

export default router;
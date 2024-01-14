import { Router } from "express";
import { checkJwt } from "../middleware/checkJwt";
import { checkRole } from "../middleware/checkRole";
import getAll from "../controller/GetAllAbstractController";
import { KhachHang } from "../entity";

const router = Router();
router.get("/", getAll(KhachHang));

export default router;

import { Router } from "express";
import { checkJwt } from "../middleware/checkJwt";
import { checkRole } from "../middleware/checkRole";
import getAll from "../controller/GetAllAbstractController";
import { LichHen } from "../entity";

const router = Router();
router.get("/", getAll(LichHen, ["MaNhaSi", "ChiTietLichHen"]));

export default router;

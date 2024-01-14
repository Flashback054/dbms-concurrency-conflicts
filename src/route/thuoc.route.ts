import { Router } from "express";
import getAll from "../controller/GetAllAbstractController";
import { Thuoc } from "../entity";
import { checkJwt } from "../middleware/checkJwt";
const router = Router();
router.get("/", getAll(Thuoc));

export default router;

import { Router } from "express";
import AuthController from "../controller/AuthController";
import { checkJwt } from "../middleware/checkJwt";

const router = Router();

router.post("/login/khach-hang", AuthController.KhachHangLogin);
router.post("/login/nha-si", AuthController.NhaSiLogin);
router.post("/login/nhan-vien", AuthController.NhanVienLogin);
router.post("/logout", AuthController.Logout);

router.get("/me", checkJwt, AuthController.Me);

export default router;

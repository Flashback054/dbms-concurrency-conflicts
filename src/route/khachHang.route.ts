import { Router } from "express";
import * as KhachHangController from "../controller/KhachHangController";
import StoreProcController from "../controller/StoreProcController";

const router = Router();

router.get("/", KhachHangController.index);
router.get("/cap-nhat-mat-khau/:id", KhachHangController.editPassword);
router.put(
  "/cap-nhat-mat-khau/:id",
  StoreProcController.Conversion_USP_CAPNHATTHONGTIN
);
router.post("/khoa-tai-khoan", StoreProcController.Conversion_USP_KHOATAIKHOAN);
router.post("/mo-khoa-tai-khoan", KhachHangController.unlockAccount);

export default router;

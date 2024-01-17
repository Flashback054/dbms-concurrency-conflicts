import { Router } from "express";
import * as ThuocController from "../controller/ThuocController";
import StoreProcController from "../controller/StoreProcController";

const router = Router();

router.get("/", ThuocController.index);
router.get("/them-thong-tin-thuoc", ThuocController.add);
router.get("/nhap-so-luong-thuoc/:id", ThuocController.editSoLuongTon);
router.patch("/nhap-so-luong-thuoc/:id", ThuocController.updateSoLuongTon);
router.post("/", StoreProcController.PhantomRead_sp_InsertThuocInstance);
router.delete("/:id", ThuocController.destroy);
router.put("/:id", ThuocController.update);
router.get(
  "/thong-ke-thuoc",
  StoreProcController.PhantomRead_sp_GetStockStatistics
);
router.get("/:id", ThuocController.show);
router.get("/cap-nhat-thuoc/:id", ThuocController.edit);

export default router;

import { Router } from "express";
import * as ThuocController from "../controller/ThuocController";
import StoreProcController from "../controller/StoreProcController";

const router = Router();

router.get("/", ThuocController.index);
router.get("/them-thong-tin-thuoc", ThuocController.add);
router.get(
  "/ban-thuoc",
  StoreProcController.UnrepeatableRead_sp_DocThongTinThuoc
);
router.post("/ban-thuoc/:id", ThuocController.sellThuoc);
router.get("/nhap-so-luong-thuoc/:id", ThuocController.editSoLuongTon);
router.patch(
  "/nhap-so-luong-thuoc/:id",
  StoreProcController.UnrepeatableRead_sp_CapNhatSoLuongTonThuoc
);
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

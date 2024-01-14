import { Router } from "express";
import StoreProcController from "../controller/StoreProcController";

// routes for calling stored procedures
const router = Router();
router.get("/test", StoreProcController.test);
router.post(
	"/dirty-read/UpdateLichHen",
	StoreProcController.DirtyRead_UpdateLichHen
);
router.post(
	"/dirty-read/ChiTietLich",
	StoreProcController.DirtyRead_ChiTietLich
);
router.post(
	"/conversion/USP_KHOATAIKHOAN",
	StoreProcController.Conversion_USP_KHOATAIKHOAN
);
router.post(
	"/conversion/USP_CAPNHATTHONGTIN",
	StoreProcController.Conversion_USP_CAPNHATTHONGTIN
);
router.post(
	"/phantom-read/sp_GetStockSatistics",
	StoreProcController.PhantomRead_sp_GetStockSatistics
);
router.post(
	"/phantom-read/sp_InsertThuocInstance",
	StoreProcController.PhantomRead_sp_InsertThuocInstance
);
router.post(
	"/lost-update/sp_UpdateSoluongtonThuoc_After",
	StoreProcController.LostUpdate_sp_UpdateSoluongtonThuoc_After
);
router.post(
	"/lost-update/sp_UpdateSoluongtonThuoc_Before",
	StoreProcController.LostUpdate_sp_UpdateSoluongtonThuoc_Before
);

router.post("/dirty-read/fix", StoreProcController.DirtyRead_Fix);
router.post("/conversion/fix", StoreProcController.Conversion_Fix);
router.post("/phantom-read/fix", StoreProcController.PhantomRead_Fix);
router.post("/lost-update/fix", StoreProcController.LostUpdate_Fix);

router.post("/dirty-read/no-fix", StoreProcController.DirtyRead_NoFix);
router.post("/conversion/no-fix", StoreProcController.Conversion_NoFix);
router.post("/phantom-read/no-fix", StoreProcController.PhantomRead_NoFix);
router.post("/lost-update/no-fix", StoreProcController.LostUpdate_NoFix);

export default router;

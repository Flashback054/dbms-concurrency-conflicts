import { AppDataSource } from "../data-source";
import { NextFunction, Request, Response } from "express";

export default class StoreProcController {
	static async DirtyRead_UpdateLichHen(
		request: Request,
		response: Response,
		next: NextFunction
	) {
		const { MaNhaSi, MaLichHen, NgayHen, ThoiGianBatDau, ThoiGianKetThuc } =
			request.body;

		const result = await AppDataSource.query(`
      EXECUTE UpdateLichHen @MaNhaSi = ${MaNhaSi}, @MaLichHen = ${MaLichHen}, @NgayHen = '${NgayHen}', @ThoiGianBatDau = '${ThoiGianBatDau}', @ThoiGianKetThuc = '${ThoiGianKetThuc}'
    `);

		response.status(200).json({
			data: result,
		});
	}
	static async DirtyRead_ChiTietLich(
		request: Request,
		response: Response,
		next: NextFunction
	) {
		const {
			MaLichHen,
			NgayHen,
			MaNhaSi,
			HoTenNhaSi,
			ThoiGianBatDau,
			ThoiGianKetThuc,
		} = request.body;

		const result = await AppDataSource.query(`
      EXECUTE ChiTietLich @MaLichHen = ${MaLichHen}, @NgayHen = '${NgayHen}', @MaNhaSi = ${MaNhaSi}, @HoTenNhaSi = '${HoTenNhaSi}', @ThoiGianBatDau = '${ThoiGianBatDau}', @ThoiGianKetThuc = '${ThoiGianKetThuc}'
    `);

		response.status(200).json({
			data: result,
		});
	}

	static async Conversion_USP_KHOATAIKHOAN(
		request: Request,
		response: Response,
		next: NextFunction
	) {
		const { MaTaiKhoan } = request.body;
		const result = await AppDataSource.query(`
      EXECUTE USP_KHOATAIKHOAN ${MaTaiKhoan}
    `);

		response.status(200).json({
			data: result,
		});
	}

	static async Conversion_USP_CAPNHATTHONGTIN(
		request: Request,
		response: Response,
		next: NextFunction
	) {
		const { MaKhachHang, MatKhau } = request.body;
		const result = await AppDataSource.query(`
      EXECUTE USP_CAPNHATTHONGTIN ${MaKhachHang}, ${MatKhau}
    `);

		response.status(200).json({
			data: result,
		});
	}

	static async LostUpdate_sp_UpdateSoluongtonThuoc_Before(
		request: Request,
		response: Response,
		next: NextFunction
	) {
		const { MaThuoc, SoThuoc } = request.body;
		const result = await AppDataSource.query(`
      EXECUTE sp_UpdateSoluongtonThuoc_Before ${MaThuoc}, ${SoThuoc}
    `);

		response.status(200).json({
			data: result,
		});
	}

	static async LostUpdate_sp_UpdateSoluongtonThuoc_After(
		request: Request,
		response: Response,
		next: NextFunction
	) {
		const { MaThuoc, SoThuoc } = request.body;
		const result = await AppDataSource.query(`
      EXECUTE sp_UpdateSoluongtonThuoc_After ${MaThuoc}, ${SoThuoc}
    `);

		response.status(200).json({
			data: result,
		});
	}

	static async PhantomRead_sp_InsertThuocInstance(
		request: Request,
		response: Response,
		next: NextFunction
	) {
		const { TenThuoc, DonViTinh, DonGia, ChiDinh, SoLuongTon, NgayHetHan } =
			request.body;

		const result = await AppDataSource.query(`
      EXECUTE sp_InsertThuocInstance '${TenThuoc}', '${DonViTinh}', ${DonGia}, '${ChiDinh}', ${SoLuongTon}, '${NgayHetHan}'
    `);

		response.status(200).json({
			data: result,
		});
	}

	static async PhantomRead_sp_GetStockSatistics(
		request: Request,
		response: Response,
		next: NextFunction
	) {
		const result = await AppDataSource.query(`
      DECLARE 
      @NoInstances INT = 0,
      @NoExpiredInstances INT = 0,
      @NoOOSInstances INT = 0,
      @ERROR_COUNT INT = 0
      EXEC @ERROR_COUNT = sp_GetStockSatistics @NoInstances OUT, @NoExpiredInstances OUT, @NoOOSInstances OUT
      SELECT @NoInstances AS NoInstances, @NoExpiredInstances AS NoExpiredInstances, @NoOOSInstances AS NoOOSInstances, @ERROR_COUNT AS ERROR_COUNT
    `);

		response.status(200).json({
			data: result,
		});
	}

	static async test(request: Request, response: Response, next: NextFunction) {
		const result = await AppDataSource.query(`
    EXECUTE sp_DocKhachHang`);
		response.status(200).json({
			data: result,
		});
	}
}

import { AppDataSource } from "../data-source";
import { NextFunction, Request, Response } from "express";
import { KhachHang } from "../entity";
import * as fs from "fs";
import * as path from "path";

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

		try {
			await AppDataSource.query(`
        EXECUTE USP_KHOATAIKHOAN ${MaTaiKhoan}
      `);

			response.redirect("/khach-hang");
		} catch (error) {
			const customers = await AppDataSource.getRepository(KhachHang).find();

			response.render("pages/danh-sach-khach-hang", {
				heading: "Danh sách khách hàng",
				error: error.message,
				customers,
			});
		}
	}

	static async Conversion_USP_CAPNHATTHONGTIN(
		request: Request,
		response: Response,
		next: NextFunction
	) {
		const { MaKhachHang, MatKhau } = request.body;

		try {
			await AppDataSource.query(`
        EXECUTE USP_CAPNHATTHONGTIN ${MaKhachHang}, ${MatKhau}
      `);
			response.render("pages/cap-nhat-mat-khau", {
				success: "Cập nhật tài khoản thành công!",
				heading: "Đổi mật khẩu",
				customer: {
					MaKhachHang,
					MatKhau,
				},
			});
		} catch (error) {
			response.render("pages/cap-nhat-mat-khau", {
				heading: "Đổi mật khẩu",
				error: error.message.toString().replace("Error: ", ""),
				customer: {
					MaKhachHang,
					MatKhau,
				},
			});
		}
	}

	static async LostUpdate_sp_UpdateSoluongtonThuoc_Before(
		request: Request,
		response: Response,
		next: NextFunction
	) {
		const { MaThuoc, SoThuoc } = request.body;
		console.log(MaThuoc, SoThuoc);
		try{
			const result = await AppDataSource.query(`
      		EXECUTE sp_UpdateSoluongtonThuoc_Before ${MaThuoc}, ${SoThuoc}
    		`);
			response.redirect("/thuoc");
		}
		catch(error){
			response.render("pages/lap-hoa-don", {
				layout: "main-boostrap",
				error: error.message.toString().replace("Error: ", ""),
			});
		}
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

		try {
			await AppDataSource.query(`
        EXECUTE sp_InsertThuocInstance '${TenThuoc}', '${DonViTinh}', ${DonGia}, '${ChiDinh}', ${SoLuongTon}, '${NgayHetHan}'
      `);

			response.redirect("/thuoc");
		} catch (error) {
			response.render("pages/them-thong-tin-thuoc", {
				heading: "Thêm thông tin thuốc",
				error: error.message.toString().replace("Error: ", ""),
			});
		}
	}

	static async PhantomRead_sp_GetStockStatistics(
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
      EXEC @ERROR_COUNT = sp_GetStockStatistics @NoInstances OUT, @NoExpiredInstances OUT, @NoOOSInstances OUT
      SELECT @NoInstances AS NoInstances, @NoExpiredInstances AS NoExpiredInstances, @NoOOSInstances AS NoOOSInstances, @ERROR_COUNT AS ERROR_COUNT
    `);

		response.render("pages/thong-ke-thuoc", {
			heading: "Thống kê số lượng thuốc",
			data: result.at(0),
			error: result.at(0).ERROR_COUNT > 0,
		});
	}

	static async UnrepeatableRead_sp_DocThongTinThuoc(
		request: Request,
		response: Response,
		next: NextFunction
	) {
		const { MaThuoc, SLMua } = request.body;

		try {
			await AppDataSource.query(`
        EXECUTE sp_DocThongTinThuoc ${MaThuoc}, ${SLMua}
      `);

			response.redirect("/thuoc");
		} catch (error) {
			response.render("pages/them-thong-tin-thuoc", {
				heading: "Thêm thông tin thuốc",
				error: error.message.toString().replace("Error: ", ""),
			});
		}
	}

	static async UnrepeatableRead_sp_CapNhatSoLuongTonThuoc(
		request: Request,
		response: Response,
		next: NextFunction
	) {
		const { MaThuoc, SoLuongTon } = request.body;

		const result = await AppDataSource.query(
			`EXEC sp_CapNhatSoLuongTonThuoc ${MaThuoc}, ${SoLuongTon}`
		);

		response.render("pages/thong-ke-thuoc", {
			heading: "Thống kê số lượng thuốc",
			data: result.at(0),
			error: result.at(0).ERROR_COUNT > 0,
		});
	}

	static async Execute_SQL(filename: string, isFix: boolean) {
		if (isFix) {
			filename += "_FIX";
		}

		const sql = fs.readFileSync(
			path.join(__dirname, `../sql/${filename}.sql`),
			"utf8"
		);

		const sqls = sql.split("GO");

		await AppDataSource.query(sqls[0]);
		await AppDataSource.query(sqls[1]);
	}

	static async Errors_NoFix() {
		await StoreProcController.Execute_SQL("PhantomRead/4_PhantomRead", false);
		await StoreProcController.Execute_SQL(
			"Conversion/5_ConversionDeadlock",
			false
		);
		// await StoreProcController.Execute_SQL("LostUpdate/7_LostUpdate", false);
	}

	static async Errors_Fix() {
		await StoreProcController.Execute_SQL("PhantomRead/4_PhantomRead", true);
		await StoreProcController.Execute_SQL(
			"Conversion/5_ConversionDeadlock",
			true
		);
		// await StoreProcController.Execute_SQL("LostUpdate/7_LostUpdate", true);

	}
}

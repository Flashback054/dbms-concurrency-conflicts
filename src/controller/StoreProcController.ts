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
        error: "Deadlock! Khóa tài khoản thất bại!",
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
        error: "Deadlock! Cập nhật tài khoản thất bại!",
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

    try {
      const result = await AppDataSource.query(`
        DECLARE @INSERTED_COUNT INT
        EXECUTE @INSERTED_COUNT = sp_InsertThuocInstance '${TenThuoc}', '${DonViTinh}', ${DonGia}, '${ChiDinh}', ${SoLuongTon}, '${NgayHetHan}'
        SELECT @INSERTED_COUNT AS INSERTED_COUNT
      `);

      const insertedCount = result.at(0).INSERTED_COUNT;

      if (insertedCount === 0) {
        throw new Error("Thêm thông tin thuốc thất bại, tên thuốc đã tồn tại!");
      }

      response.redirect("/thuoc");
    } catch (error) {
      response.render("pages/them-thong-tin-thuoc", {
        heading: "Thêm thông tin thuốc",
        error: error.message,
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
      EXEC @ERROR_COUNT = sp_GetStockSatistics @NoInstances OUT, @NoExpiredInstances OUT, @NoOOSInstances OUT
      SELECT @NoInstances AS NoInstances, @NoExpiredInstances AS NoExpiredInstances, @NoOOSInstances AS NoOOSInstances, @ERROR_COUNT AS ERROR_COUNT
    `);

    response.render("pages/thong-ke-thuoc", {
      heading: "Thống kê số lượng thuốc",
      data: result.at(0),
      error: result.at(0).ERROR_COUNT > 0,
    });
  }

  static async test(request: Request, response: Response, next: NextFunction) {
    const result = await AppDataSource.query(`
    EXECUTE sp_DocKhachHang`);
    response.status(200).json({
      data: result,
    });
  }

  static async DirtyRead_NoFix(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    // Read .SQL file
    const sql = fs.readFileSync(
      path.join(__dirname, "../sql/DirtyRead/CapNhatLich.sql"),
      "utf8"
    );

    // Execute SQL
    // Split sql by GO
    const sqls = sql.split("GO");

    // Execute SQL
    await AppDataSource.query(sqls[0]);
    await AppDataSource.query(sqls[1]);

    response.status(200).json({});
  }

  static async DirtyRead_Fix(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    // Read .SQL file
    const sql = fs.readFileSync(
      path.join(__dirname, "../sql/DirtyRead/CapNhatLich_fix.sql"),
      "utf8"
    );

    // Execute SQL
    // Split sql by GO
    const sqls = sql.split("GO");

    // Execute SQL
    await AppDataSource.query(sqls[0]);
    await AppDataSource.query(sqls[1]);

    response.status(200).json({});
  }

  static async Conversion_NoFix(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    // Read .SQL file
    const sql = fs.readFileSync(
      path.join(__dirname, "../sql/Conversion/Conversion-deadlock.sql"),
      "utf8"
    );

    // Execute SQL
    // Split sql by GO
    const sqls = sql.split("GO");

    // Execute SQL
    await AppDataSource.query(sqls[0]);
    await AppDataSource.query(sqls[1]);

    response.status(200).json({});
  }

  static async Conversion_Fix(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    // Read .SQL file
    const sql = fs.readFileSync(
      path.join(__dirname, "../sql/Conversion/Conversion-deadlock_fix.sql"),
      "utf8"
    );

    // Execute SQL
    // Split sql by GO
    const sqls = sql.split("GO");

    // Execute SQL
    await AppDataSource.query(sqls[0]);
    await AppDataSource.query(sqls[1]);

    response.status(200).json({});
  }

  static async LostUpdate_NoFix(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    // Read .SQL file
    const sql = fs.readFileSync(
      path.join(__dirname, "../sql/LostUpdate/7_LostUpdate.sql"),
      "utf8"
    );

    // Execute SQL
    // Split sql by GO
    const sqls = sql.split("GO");

    // Execute SQL
    await AppDataSource.query(sqls[0]);
    await AppDataSource.query(sqls[1]);

    response.status(200).json({});
  }

  static async LostUpdate_Fix(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    // Read .SQL file
    const sql = fs.readFileSync(
      path.join(__dirname, "../sql/LostUpdate/7_LostUpdate_FIX.sql"),
      "utf8"
    );

    // Execute SQL
    // Split sql by GO
    const sqls = sql.split("GO");

    // Execute SQL
    await AppDataSource.query(sqls[0]);
    await AppDataSource.query(sqls[1]);

    response.status(200).json({});
  }

  static async PhantomRead_NoFix(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    // Read .SQL file
    const sql = fs.readFileSync(
      path.join(__dirname, "../sql/PhantomRead/4_PhantomRead.sql"),
      "utf8"
    );

    // Execute SQL
    // Split sql by GO
    const sqls = sql.split("GO");

    // Execute SQL
    await AppDataSource.query(sqls[0]);
    await AppDataSource.query(sqls[1]);

    response.status(200).json({});
  }

  static async PhantomRead_Fix(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    // Read .SQL file
    const sql = fs.readFileSync(
      path.join(__dirname, "../sql/PhantomRead/4_PhantomRead_FIX.sql"),
      "utf8"
    );

    // Split sql by GO
    const sqls = sql.split("GO");

    // Execute SQL
    await AppDataSource.query(sqls[0]);
    await AppDataSource.query(sqls[1]);

    response.status(200).json({});
  }
}

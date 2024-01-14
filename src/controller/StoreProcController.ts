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
}

import { AppDataSource } from "../data-source";
import { NextFunction, Request, Response } from "express";
import { Thuoc } from "../entity";

export async function index(req: Request, res: Response, next: NextFunction) {
  const medicines = await AppDataSource.getRepository(Thuoc).find();

  res.render("pages/danh-sach-thuoc", {
    heading: "Danh sách thuốc",
    medicines,
    noInstances: medicines.length,
  });
}

export async function show(req: Request, res: Response, next: NextFunction) {
  const medicine = await AppDataSource.getRepository(Thuoc).findOne({
    where: { MaThuoc: +req.params.id },
  });

  res.render("pages/chi-tiet-thuoc", {
    heading: "Thông tin thuốc",
    medicine,
  });
}

export function add(req: Request, res: Response, next: NextFunction) {
  res.render("pages/them-thong-tin-thuoc", {
    heading: "Thêm thông tin thuốc",
  });
}

export async function create(req: Request, res: Response, next: NextFunction) {
  const { ChiDinh, TenThuoc, DonViTinh, DonGia, SoLuongTon, NgayHetHan } =
    req.body;

  const medicine = new Thuoc();
  medicine.TenThuoc = TenThuoc;
  medicine.DonViTinh = DonViTinh;
  medicine.DonGia = DonGia;
  medicine.SoLuongTon = SoLuongTon;
  medicine.ChiDinh = ChiDinh;
  medicine.NgayHetHan = NgayHetHan;

  try {
    await AppDataSource.getRepository(Thuoc).save(medicine);
  } catch (error) {
    return res.render("pages/them-thong-tin-thuoc", {
      heading: "Thêm thông tin thuốc",
      error: "Thêm thông tin thuốc thất bại, tên thuốc đã tồn tại!",
    });
  }

  res.redirect("/thuoc");
}

export async function edit(req: Request, res: Response, next: NextFunction) {
  const medicine = await AppDataSource.getRepository(Thuoc).findOne({
    where: { MaThuoc: +req.params.id },
  });

  res.render("pages/cap-nhat-thuoc", {
    heading: "Cập nhật thông tin thuốc",
    medicine,
  });
}

export async function update(req: Request, res: Response, next: NextFunction) {
  const { ChiDinh, TenThuoc, DonViTinh, DonGia, SoLuongTon, NgayHetHan } =
    req.body;

  const medicine = new Thuoc();
  medicine.TenThuoc = TenThuoc;
  medicine.DonViTinh = DonViTinh;
  medicine.DonGia = DonGia;
  medicine.SoLuongTon = SoLuongTon;
  medicine.ChiDinh = ChiDinh;
  medicine.NgayHetHan = NgayHetHan;

  await AppDataSource.getRepository(Thuoc).update(
    { MaThuoc: +req.params.id },
    medicine
  );

  res.redirect("/thuoc");
}

export async function destroy(req: Request, res: Response, next: NextFunction) {
  await AppDataSource.getRepository(Thuoc).delete({
    MaThuoc: +req.params.id,
  });

  res.redirect("/thuoc");
}

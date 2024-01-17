import { AppDataSource } from "../data-source";
import { NextFunction, Request, Response } from "express";
import { KhachHang } from "../entity";

export async function index(req: Request, res: Response, next: NextFunction) {
  const customers = await AppDataSource.getRepository(KhachHang).find();

  res.render("pages/danh-sach-khach-hang", {
    heading: "Danh sách khách hàng",
    customers,
    noInstances: customers.length,
  });
}

export async function editPassword(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const customer = await AppDataSource.getRepository(KhachHang).findOne({
    where: { MaKhachHang: +req.params.id },
  });

  res.render("pages/cap-nhat-mat-khau", {
    heading: "Đổi mật khẩu",
    customer,
  });
}

export async function unlockAccount(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { MaTaiKhoan } = req.body;

  await AppDataSource.getRepository(KhachHang).update(
    { MaKhachHang: MaTaiKhoan },
    { TrangThai: null }
  );

  res.redirect("/khach-hang");
}

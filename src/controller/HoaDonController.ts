import { AppDataSource } from "../data-source";
import { NextFunction, Request, Response } from "express";
import { Thuoc } from "../entity";
import { KhachHang } from "../entity";

export async function index(req: Request, res: Response, next: NextFunction) {
    const getMedicine = await AppDataSource.getRepository(Thuoc).findOne({
        where: { MaThuoc: +1 },
      });
    
    const medicine = {
        getMedicine,
        quantity: 2,
        totalPrice: 2 * getMedicine.DonGia,
      };
    const customer = await AppDataSource.getRepository(KhachHang).findOne({
        where: { MaKhachHang: +1 },
      });

    const now = new Date();
    const invoiceDate = now.toLocaleString('vi-VN', {
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit', 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit',
        hour12: false
    });

    const data = {
        customer,
        invoiceDate,
        services: [
          { name: "Khám nha khoa", price: 500000 },
          { name: "Tẩy trắng răng", price: 1200000 },
        ],
        medications: [
           medicine,
        ],
        total: 1700000 + medicine.totalPrice
      };
    
      res.render("pages/lap-hoa-don", {
        layout: "main-boostrap",
        data,
      });
}
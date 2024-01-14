import { AppDataSource } from "../data-source";
import { NextFunction, Request, Response } from "express";
import { KhachHang } from "../entity";

export class KhachHangController {
	private KhachHangRepository = AppDataSource.getRepository(KhachHang);

	async all(request: Request, response: Response, next: NextFunction) {
		return this.KhachHangRepository.find();
	}

	async one(request: Request, response: Response, next: NextFunction) {
		const id = parseInt(request.params.id);

		const KhachHang = await this.KhachHangRepository.findOne({
			where: { MaKhachHang: id },
		});

		if (!KhachHang) {
			throw new Error("Not found");
		}
		return KhachHang;
	}
}

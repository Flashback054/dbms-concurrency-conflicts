import { AppDataSource } from "../data-source";
import { NextFunction, Request, Response } from "express";
import { NhanVien } from "../entity";

export class NhanVienController {
	private NhanVienRepository = AppDataSource.getRepository(NhanVien);

	async all(request: Request, response: Response, next: NextFunction) {
		return this.NhanVienRepository.find();
	}

	async one(request: Request, response: Response, next: NextFunction) {
		const id = parseInt(request.params.id);

		const NhanVien = await this.NhanVienRepository.findOne({
			where: { MaNhanVien: id },
		});

		if (!NhanVien) {
			throw new Error("Not found");
		}
		return NhanVien;
	}
}

import { AppDataSource } from "../data-source";
import { NextFunction, Request, Response } from "express";
import { NhaSi } from "../entity";

export class NhaSiController {
	private NhaSiRepository = AppDataSource.getRepository(NhaSi);

	async all(request: Request, response: Response, next: NextFunction) {
		return this.NhaSiRepository.find();
	}

	async one(request: Request, response: Response, next: NextFunction) {
		const id = parseInt(request.params.id);

		const NhaSi = await this.NhaSiRepository.findOne({
			where: { MaNhaSi: id },
		});

		if (!NhaSi) {
			throw new Error("Not found");
		}
		return NhaSi;
	}
}

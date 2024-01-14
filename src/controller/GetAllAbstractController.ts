// A getAll abstract controller function (allow getting all entities and allow applying filter)

import { Request, Response } from "express";
import { AppDataSource } from "../data-source";

export default function getAll(entity: any, relations?: string[]) {
	return async (req: Request, res: Response) => {
		const repository = AppDataSource.getRepository(entity);
		const entities = await repository.find({
			relations,
			where: req.query,
		});

		res.status(200).json({
			data: entities,
		});
	};
}

import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import config from "../config/config";
import { AppDataSource } from "../data-source";

import { KhachHang, NhaSi, NhanVien } from "../entity";

export const checkJwt = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	//Get the jwt token from cookie
	const token = <string>req.cookies["jwt"];
	let jwtPayload;

	//Try to validate the token and get data
	try {
		jwtPayload = <any>jwt.verify(token, config.jwtSecret);
		res.locals.jwtPayload = jwtPayload;
	} catch (error) {
		//If token is not valid, respond with 401 (unauthorized)
		res.status(401).json({
			error: {
				message: "Token không hợp lệ",
			},
		});
		return;
	}

	// Check id and role
	let { id, role } = jwtPayload;
	if (id == null || role == null) {
		res.status(401).json({
			error: {
				message: "Token không hợp lệ",
			},
		});
		return;
	}

	let user: KhachHang | NhaSi | NhanVien;

	if (role == "KhachHang") {
		const KhachHangRepository = AppDataSource.getRepository(KhachHang);
		try {
			user = await KhachHangRepository.findOneOrFail({
				where: { MaKhachHang: id },
			});
		} catch (id) {
			return res.status(401).json({
				error: {
					message: "Không tìm thấy khách hàng",
				},
			});
		}
	} else if (role == "NhaSi") {
		const NhaSiRepository = AppDataSource.getRepository(NhaSi);
		try {
			user = await NhaSiRepository.findOneOrFail({ where: { MaNhaSi: id } });
		} catch (id) {
			return res.status(401).json({});
		}
	} else if (role == "NhanVien") {
		const NhanVienRepository = AppDataSource.getRepository(NhanVien);
		try {
			user = await NhanVienRepository.findOneOrFail({
				where: { MaNhanVien: id },
			});
		} catch (id) {
			return res.status(401).json({});
		}
	}

	// Set user to res.locals
	res.locals.user = user;

	//Call the next middleware or controller
	next();
};

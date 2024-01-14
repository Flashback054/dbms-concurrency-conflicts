import { Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { AppDataSource } from "../data-source";

import { KhachHang, NhaSi, NhanVien } from "../entity";
import config from "../config/config";

class AuthController {
	static KhachHangLogin = async (req: Request, res: Response) => {
		//Check if username and password are set
		let { SDT, MatKhau } = req.body;
		if (!(SDT && MatKhau)) {
			res.status(400).send();
		}

		//Get user from database
		const khachHangRepository = AppDataSource.getRepository(KhachHang);
		let user: KhachHang;
		try {
			user = await khachHangRepository.findOneOrFail({
				where: { SDT, MatKhau },
			});
		} catch (error) {
			res.status(401);
		}

		if (!user) {
			res.status(401).json({
				error: {
					message: "Sai tài khoản hoặc mật khẩu",
				},
			});
			return;
		}

		//Sing JWT, valid for 1 hour
		const token = jwt.sign(
			{ id: user.MaKhachHang, role: "KhachHang" },
			config.jwtSecret,
			{ expiresIn: "24h" }
		);

		//Send the jwt in the response
		res.cookie("jwt", token, { httpOnly: true });
		res.status(200).json({
			jwt: token,
		});
	};

	static NhaSiLogin = async (req: Request, res: Response) => {
		//Check if username and password are set
		let { SDT, MatKhau } = req.body;
		if (!(SDT && MatKhau)) {
			res.status(400).send();
		}

		//Get user from database
		const nhaSiRepository = AppDataSource.getRepository(NhaSi);
		let user: NhaSi;
		try {
			user = await nhaSiRepository.findOneOrFail({
				where: { SDT, MatKhau },
			});
		} catch (error) {
			res.status(401).send();
		}

		//Check if encrypted password match
		if (!user) {
			res.status(401).json({
				error: {
					message: "Sai tài khoản hoặc mật khẩu",
				},
			});
			return;
		}

		//Sing JWT, valid for 1 hour
		const token = jwt.sign(
			{ id: user.MaNhaSi, role: "NhaSi" },
			config.jwtSecret,
			{ expiresIn: "24h" }
		);

		//Send the jwt in the response
		res.cookie("jwt", token, { httpOnly: true });
		res.status(200).json({
			jwt: token,
		});
	};

	static NhanVienLogin = async (req: Request, res: Response) => {
		//Check if username and password are set
		const { SDT, MatKhau } = req.body;
		if (!(SDT && MatKhau)) {
			res.status(400).json({
				error: {
					message: "Phải nhập SĐT và mật khẩu",
				},
			});
		}

		//Get user from database
		const nhanVienRepository = AppDataSource.getRepository(NhanVien);
		let user: NhanVien;
		try {
			user = await nhanVienRepository.findOneOrFail({
				where: { SDT, MatKhau },
			});
		} catch (error) {
			res.status(401).send();
		}

		//Check if encrypted password match
		if (!user) {
			res.status(401).json({
				error: {
					message: "Sai tài khoản hoặc mật khẩu",
				},
			});
			return;
		}

		//Sing JWT, valid for 1 hour
		const token = jwt.sign(
			{ id: user.MaNhanVien, role: "NhanVien" },
			config.jwtSecret,
			{ expiresIn: "24h" }
		);

		//Send the jwt in the response
		res.cookie("jwt", token, { httpOnly: true });
		res.status(200).json({
			jwt: token,
		});
	};

	static async Logout(req: Request, res: Response) {
		res.cookie("jwt", "", { httpOnly: true, expires: new Date(0) });
		res.status(200).json({
			message: "Đăng xuất thành công",
		});
	}

	static async Me(req: Request, res: Response) {
		const { id, role } = res.locals.user;
		// let user;
		// switch (role) {
		// 	case "KhachHang":
		// 		user = await AppDataSource.getRepository(KhachHang).findOneOrFail(id);
		// 		break;
		// 	case "NhaSi":
		// 		user = await AppDataSource.getRepository(NhaSi).findOneOrFail(id);
		// 		break;
		// 	case "NhanVien":
		// 		user = await AppDataSource.getRepository(NhanVien).findOneOrFail(id);
		// 		break;
		// 	default:
		// 		break;
		// }

		res.status(200).json({
			data: res.locals.user,
		});
	}
}
export default AuthController;

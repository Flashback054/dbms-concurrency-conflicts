import { Request, Response, NextFunction } from "express";

export const checkRole = (roles: Array<string>) => {
	return async (req: Request, res: Response, next: NextFunction) => {
		const { user } = res.locals;
		if (user == null) {
			res.status(401).json({
				error: {
					message: "Bạn chưa đăng nhập",
				},
			});
			return;
		}
		if (roles.indexOf(user.role) > -1) {
			next();
			return;
		}
		res.status(401).json({
			error: {
				message: "Bạn không có quyền truy cập",
			},
		});
	};
};

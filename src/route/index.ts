import { Router, Request, Response } from "express";
import auth from "./auth.route";
import thuoc from "./thuoc.route";
import lichHen from "./lichHen.route";
import storeProc from "./storeProc.route";
import khachHang from "./khachHang.route";

const routes = Router();

routes.use("/auth", auth);
routes.use("/lich-hen", lichHen);
routes.use("/khach-hang", khachHang);
routes.use("/sp", storeProc);
routes.use("/thuoc", thuoc);

export default routes;

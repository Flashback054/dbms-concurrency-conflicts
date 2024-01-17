import { Router } from "express";

import auth from "./auth.route";
import checkout from "./checkout.route";
import home from "./home.route";
import khachHang from "./khachHang.route";
import lichHen from "./lichHen.route";
import thuoc from "./thuoc.route";

const routes = Router();

routes.use("/", home);
routes.use("/", checkout);
routes.use("/auth", auth);
routes.use("/lich-hen", lichHen);
routes.use("/khach-hang", khachHang);
routes.use("/thuoc", thuoc);

export default routes;

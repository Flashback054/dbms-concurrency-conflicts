import { Router, Request, Response } from "express";
import auth from "./auth.route";
import thuoc from "./thuoc.route";
import lichHen from "./lichHen.route";
import storeProc from "./storeProc.route";

const routes = Router();

routes.get("/", (req, res) => {
  res.render("pages/trang-chu", {
    heading: "Danh sách các tình huống tranh chấp",
    noBack: true,
  });
});
routes.use("/auth", auth);
routes.use("/lich-hen", lichHen);
routes.use("/sp", storeProc);
routes.use("/thuoc", thuoc);

export default routes;

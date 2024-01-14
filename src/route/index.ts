import { Router } from "express";
import auth from "./auth.route";
import thuoc from "./thuoc.route";
import lichHen from "./lichHen.route";
import storeProc from "./storeProc.route";
import khachHang from "./khachHang.route";

const routes = Router();

routes.get("/", (req, res) => {
  res.render("pages/trang-chu", {
    heading: "Danh sách các tình huống tranh chấp",
    noBack: true,
  });
});

routes.use("/auth", auth);
routes.use("/lich-hen", lichHen);
routes.use("/khach-hang", khachHang);
routes.use("/sp", storeProc);
routes.use("/thuoc", thuoc);

routes.use("/thanh-toan", (req, res) => {
  const searchResults = {
    personalInfo: {
      recordId: "HS001",
      fullname: "Nguyễn Văn A",
      phone: "0912345678",
      birthdate: "01/01/1990",
    },
    visits: [
      {
        times: 1,
        dentist: "Johny Dog",
        services: ["Khám tim mạch", "Xét nghiệm máu"],
        medicines: [
          { name: "Aspirin", quantity: "2 hộp" },
          { name: "Paracetamol", quantity: "1 hộp" },
        ],
        description: "Tình trạng ổn định",
        isPayment: true,
      },
      {
        times: 2,
        dentist: "Tommy Nguyen",
        services: ["Khám nội tổng quát"],
        medicines: [{ name: "Lisinopril", quantity: "1 hộp" }],
        description: "Kiểm tra huyết áp",
        isPayment: false,
      },
    ],
  };

  res.render("pages/thanh-toan", {
    layout: "main-boostrap",
    searchResults,
  });
});

routes.use("/lap-hoa-don", (req, res) => {
  const data = {
    recordId: "HS001",
    visitNumber: "5",
    fullname: "Nguyễn Văn A",
    phone: "0912345678",
    birthdate: "01/01/1990",
    invoiceDate: "15/04/2024",
    services: [
      { name: "Khám nha khoa", price: 500000 },
      { name: "Tẩy trắng răng", price: 1200000 },
    ],
    medications: [
      {
        code: "T001",
        name: "Paracetamol",
        quantity: 1,
        price: 50000,
        totalPrice: 50000,
      },
      {
        code: "T002",
        name: "Amoxicillin",
        quantity: 1,
        price: 120000,
        totalPrice: 120000,
      },
    ],
    total: "1.870.000",
  };

  res.render("pages/lap-hoa-don", {
    layout: "main-boostrap",
    data,
  });
});

export default routes;

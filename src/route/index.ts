import { Router } from "express";
import auth from "./auth.route";
import khachHang from "./khachHang.route";
import lichHen from "./lichHen.route";
import storeProc from "./storeProc.route";
import thuoc from "./thuoc.route";

const routes = Router();

routes.get("/", (req, res) => {
  type ConflictPairItem = {
    label: string;
    url: string;
  };

  type ConflictPair = {
    label: string;
    type: string;
    color: string;
    item1?: ConflictPairItem;
    item2?: ConflictPairItem;
  };

  const pairs: ConflictPair[] = [
    {
      label: "21120499 - Nguyễn Duy Long",
      type: "Dirty Read",
      color: "blue",
      item1: {
        label: "Tình huống 1: ",
        url: "/tai-khoan/cap-nhat-mat-khau",
      },
      item2: {
        label: "Tình huống 2: ",
        url: "/tai-khoan",
      },
    },
    {
      label: "21120500 - Mai Văn Minh",
      type: "Conversion deadlock",
      color: "orange",
      item1: {
        label: "Cập nhật mật khẩu",
        url: "/khach-hang",
      },
      item2: {
        label: "Khóa tài khoản",
        url: "/khach-hang",
      },
    },
    {
      label: "21120502 - Trần Đức Minh",
      type: "Unrepeatable read",
      color: "purple",
      item1: {
        label: "Tình huống 1: ",
        url: "/tai-khoan/cap-nhat-mat-khau",
      },
      item2: {
        label: "Tình huống 2: ",
        url: "/tai-khoan",
      },
    },
    {
      label: "21120521 - Nguyễn Phúc Phát",
      type: "Lost update",
      color: "yellow",
      item1: {
        label: "Lập hóa đơn ",
        url: "/lap-hoa-don",
      },
      item2: {
        label: "Thanh toán",
        url: "/thanh-toan",
      },
    },
    {
      label: "21120524 - Trương Minh Phát",
      type: "Phantom Read",
      color: "green",
      item1: {
        label: "Thống kê số lượng thuốc: ",
        url: "/thuoc/thong-ke-thuoc",
      },
      item2: {
        label: "Thêm thông tin thuốc: ",
        url: "/thuoc/them-thong-tin-thuoc",
      },
    },
  ];

  res.render("pages/trang-chu", {
    heading: "Danh sách các tình huống tranh chấp",
    isBackHidden: true,
    pairs,
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

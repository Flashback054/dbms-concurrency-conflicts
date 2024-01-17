import { Router } from "express";
import StoreProcController from "../controller/StoreProcController";

const router = Router();

type Mode = "conflict" | "resolved";

let currentMode: Mode = "conflict";

router.get("/", async (req, res) => {
  type ConflictPairItem = {
    label: string;
    url: string;
  };

  type ConflictPair = {
    label: string;
    type: string;
    item1?: ConflictPairItem;
    item2?: ConflictPairItem;
  };

  const modeLabel: Record<Mode, string> = {
    conflict: "Tình huống tranh chấp",
    resolved: "Tình huống đã giải quyết",
  };

  const pairs: ConflictPair[] = [
    {
      label: "21120499 - Nguyễn Duy Long",
      type: "Dirty Read",
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
      item1: {
        label: "Nhập số lượng thuốc trong kho ",
        url: "/thuoc",
      },
      item2: {
        label: "Tình huống 2: ",
        url: "/tai-khoan",
      },
    },
    {
      label: "21120521 - Nguyễn Phúc Phát",
      type: "Lost update",
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

  if (currentMode == "conflict") {
    await StoreProcController.Errors_NoFix();
  } else {
    await StoreProcController.Errors_Fix();
  }

  res.render("pages/trang-chu", {
    heading: "Danh sách các tình huống tranh chấp",
    isBackHidden: true,
    pairs,
    currentMode,
    modeLabel: modeLabel[currentMode],
  });
});

router.post("/toggle-mode", (req, res) => {
  currentMode = currentMode == "conflict" ? "resolved" : "conflict";

  res.redirect("/");
});

export default router;

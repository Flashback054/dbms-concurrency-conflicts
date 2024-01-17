import { Router } from "express";

const router = Router();

type Mode = "conflict" | "resolved";

let currentMode: Mode = "conflict";

router.get("/", (req, res) => {
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

  const modeLabel: Record<Mode, string> = {
    conflict: "Tình huống tranh chấp",
    resolved: "Tình huống đã giải quyết",
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
    currentMode,
    modeLabel: modeLabel[currentMode],
  });
});

router.post("/toggle-mode", (req, res) => {
  if (currentMode == "conflict") {
    currentMode = "resolved";
    // run the sql script to resolve the conflicts
  } else {
    currentMode = "conflict";
    // run the sql script to create the conflicts
  }

  res.redirect("/");
});

export default router;

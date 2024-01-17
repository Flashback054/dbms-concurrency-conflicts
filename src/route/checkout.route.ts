import { Router } from "express";
import * as HoaDonController from "../controller/HoaDonController";
import StoreProcController from "../controller/StoreProcController";


const router = Router();

router.get("/thanh-toan", (req, res) => {
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

router.get("/lap-hoa-don", HoaDonController.index); 

router.post("/thanh-toan-hoa-don",StoreProcController.LostUpdate_sp_UpdateSoluongtonThuoc_Before);

export default router;

import "reflect-metadata";
import { DataSource } from "typeorm";
import {
  KhachHang,
  NhaSi,
  NhanVien,
  LichHen,
  ChiTietLichHen,
  Thuoc,
} from "./entity";

export const AppDataSource = new DataSource({
  type: "mssql",
  host: "localhost",
  username: "admin",
  password: "admin",
  database: "QLPHONGKHAMNHAKHOA",
  synchronize: false,
  logging: false,
  entities: [KhachHang, NhaSi, NhanVien, LichHen, ChiTietLichHen, Thuoc],
  options: {
    trustServerCertificate: true,
  },
  migrations: [],
  subscribers: [],
});

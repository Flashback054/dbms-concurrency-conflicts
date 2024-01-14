// import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

// @Entity()
// export class HoaDon {
// 	@Column()
// 	MaHoSo: number;

// 	@Column()
// 	LanKham: number;

// 	@PrimaryGeneratedColumn()
// 	SoHoaDon: number;

// 	@Column()
// 	TongTien: number;

// 	@Column()
// 	MaNhanVienLap: number;

// 	@Column({ type: "date" })
// 	NgayLap: string;

// 	@ManyToOne(() => HoSoLanKham, (hoSoLanKham) => hoSoLanKham.hoaDon)
// 	hoSoLanKham: HoSoLanKham;

// 	@ManyToOne(() => NhanVien, (nhanVien) => nhanVien.hoaDon)
// 	nhanVien: NhanVien;
// }

// import {
// 	Entity,
// 	Column,
// 	PrimaryGeneratedColumn,
// 	ManyToOne,
// 	OneToMany,
// } from "typeorm";
// import { HoSoBenhAn } from "./HoSoBenhAn";
// import { HoSoKham_Thuoc } from "./HoSoKham_Thuoc";
// import { HoSoKham_DichVu } from "./HoSoKham_DichVu";

// // HoSoLanKham Entity
// @Entity()
// export class HoSoLanKham {
// 	@Column()
// 	MaHoSo: number;

// 	@Column()
// 	LanKham: number;

// 	@Column({ type: "date" })
// 	NgayKham: string;

// 	@Column()
// 	NguoiThucHienKham: number;

// 	@Column()
// 	MoTa: string;

// 	@ManyToOne(() => HoSoBenhAn, (hoSoBenhAn) => hoSoBenhAn.hoSoLanKham)
// 	hoSoBenhAn: HoSoBenhAn;

// 	@OneToMany(
// 		() => HoSoKham_Thuoc,
// 		(hoSoKham_Thuoc) => hoSoKham_Thuoc.hoSoLanKham
// 	)
// 	hoSoKham_Thuoc: HoSoKham_Thuoc[];

// 	@OneToMany(
// 		() => HoSoKham_DichVu,
// 		(hoSoKham_DichVu) => hoSoKham_DichVu.hoSoLanKham
// 	)
// 	hoSoKham_DichVu: HoSoKham_DichVu[];
// }

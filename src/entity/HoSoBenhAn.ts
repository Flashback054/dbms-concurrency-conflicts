// import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
// import { HoSoLanKham } from "./HoSoLanKham";

// @Entity()
// export class HoSoBenhAn {
// 	@PrimaryGeneratedColumn()
// 	MaHoSo: number;

// 	@Column()
// 	DiaChi: string;

// 	@Column()
// 	HoTen: string;

// 	@Column({ type: "date" })
// 	NgaySinh: string;

// 	@Column({ unique: true })
// 	SDT: string;

// 	@Column()
// 	MaNhaSiGhiNhan: number;

// 	@OneToMany(() => HoSoLanKham, (hoSoLanKham) => hoSoLanKham.hoSoBenhAn)
// 	hoSoLanKham: HoSoLanKham[];
// }

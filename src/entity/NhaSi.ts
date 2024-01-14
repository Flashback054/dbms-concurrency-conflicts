import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { LichHen } from "./LichHen";

@Entity({ name: "NhaSi" })
export class NhaSi {
	@PrimaryGeneratedColumn()
	MaNhaSi: number;

	@Column()
	HoTen: string;

	@Column()
	MatKhau: string;

	@Column({ unique: true })
	SDT: string;

	@Column()
	TrangThai: string;
}

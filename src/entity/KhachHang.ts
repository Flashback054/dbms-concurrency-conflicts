import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	PrimaryColumn,
	OneToMany,
} from "typeorm";
import { LichHen } from "./LichHen";

@Entity({ name: "KhachHang" })
export class KhachHang {
	@PrimaryGeneratedColumn()
	MaKhachHang: number;

	@Column()
	HoTen: string;

	@Column({ type: "date" })
	NgaySinh: string;

	@Column()
	SDT: string;

	@Column()
	DiaChi: string;

	@Column()
	MatKhau: string;

	@Column()
	TrangThai: string;
}

import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity({ name: "NhanVien" })
export class NhanVien {
	@PrimaryGeneratedColumn()
	MaNhanVien: number;

	@Column()
	HoTen: string;

	@Column({ unique: true })
	SDT: string;

	@Column()
	MatKhau: string;

	@Column()
	TrangThai: string;
}

import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Thuoc {
	@PrimaryGeneratedColumn()
	MaThuoc: number;

	@Column()
	TenThuoc: string;

	@Column()
	DonViTinh: string;

	@Column()
	DonGia: number;

	@Column()
	ChiDinh: string;

	@Column()
	SoLuongTon: number;

	@Column({ type: "date" })
	NgayHetHan: string;
}

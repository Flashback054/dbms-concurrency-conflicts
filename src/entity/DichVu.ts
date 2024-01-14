import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class DichVu {
	@PrimaryGeneratedColumn()
	MaDichVu: number;

	@Column()
	TenDichVu: string;

	@Column()
	ThoiGianThucHien: number;

	@Column()
	ChiPhi: number;
}

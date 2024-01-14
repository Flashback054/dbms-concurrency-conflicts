import {
	Column,
	Entity,
	JoinColumn,
	ManyToOne,
	OneToMany,
	OneToOne,
	PrimaryGeneratedColumn,
} from "typeorm";
import { KhachHang } from "./KhachHang";
import { NhaSi } from "./NhaSi";
import { ChiTietLichHen } from "./ChiTietLichHen";

@Entity({ name: "LichHen" })
export class LichHen {
	@PrimaryGeneratedColumn()
	MaLichHen: number;

	@Column()
	NgayHen: Date;

	@Column()
	MaNguoiDat: number;

	@Column()
	@ManyToOne(() => NhaSi)
	@JoinColumn({ name: "MaNhaSi" })
	MaNhaSi: number;

	@Column()
	HoTenNguoiHen: string;

	@Column()
	SDTNguoiHen: string;

	@OneToOne(() => ChiTietLichHen, (chitietlichhen) => chitietlichhen.MaLichHen)
	ChiTietLichHen: number;
}

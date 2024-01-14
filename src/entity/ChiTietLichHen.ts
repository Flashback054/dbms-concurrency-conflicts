import {
	Entity,
	Column,
	PrimaryColumn,
	ManyToOne,
	JoinColumn,
	OneToOne,
} from "typeorm";
import { LichHen } from "./LichHen";

@Entity({ name: "ChiTietLichHen" })
export class ChiTietLichHen {
	@PrimaryColumn()
	@OneToOne(() => LichHen, (lichhen) => lichhen.MaLichHen)
	@JoinColumn({ name: "MaLichHen" })
	MaLichHen: number;

	@PrimaryColumn()
	ThoiGianBatDau: string;

	@Column()
	ThoiGianKetThuc: string;
}

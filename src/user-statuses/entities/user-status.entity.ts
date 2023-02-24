import { Column, Entity, PrimaryColumn } from "typeorm";
import { UserStatusCode } from "../../users/enums/user-status-code.enum";

@Entity({ name: 'user_statuses' })
export class UserStatus {
    @PrimaryColumn({ name: 'code' })
    public readonly code: UserStatusCode;

    @Column({ name: 'name' })
    public name: string;

    @Column({ name: 'color' })
    public color: string;
}
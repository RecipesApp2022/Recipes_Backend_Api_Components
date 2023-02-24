import { PasswordResetsMigration1665090705762 } from "src/database/migrations/1665090705762-PasswordResetsMigration";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: PasswordResetsMigration1665090705762.tableName })
export class PasswordReset {
    @PrimaryGeneratedColumn({ name: 'id' })
    public readonly id: number;

    @Column({ name: 'token' })
    public token: string;

    @Column({ name: 'email' })
    public email: string;

    @CreateDateColumn({
        name: 'created_at',
    })
    public createdAt: Date;

    @UpdateDateColumn({
        name: 'updated_at',
        select: false,
    })
    public updatedAt: Date;

    static create(data: Partial<PasswordReset>): PasswordReset {
        return Object.assign(new PasswordReset(), data);
    }
}
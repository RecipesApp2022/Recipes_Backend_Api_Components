import { User } from "src/users/entities/user.entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from "typeorm";

@Entity({ name: 'clients' })
export class Client {
    @PrimaryColumn({ name: 'user_id' })
    public userId: number;

    @OneToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    public user: User;
    
    @Column({ name: 'name' })
    public name: string;
    
    @Column({ name: 'phone_number' })
    public phoneNumber: string;

    @Column({ name: 'instagram' })
    public instagram: string;

    @Column({ name: 'paypal' })
    public paypal: string;
    
    @Column({ name: 'img_path' })
    public imgPath: string;

    static create(data: Partial<Client>): Client {
        return Object.assign(new Client(), data);
    }
}
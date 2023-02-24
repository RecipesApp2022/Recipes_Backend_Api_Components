import { Column, Entity, JoinColumn, OneToOne } from "typeorm";
import { User } from "../../users/entities/user.entity";

@Entity({ name: 'admins' })
export class Admin {
  @OneToOne(() => User, { primary: true })
  @JoinColumn({ name: 'user_id' })
  public user: User;

  @Column({ name: 'name' })
  public name: string;

  @Column({ name: 'phone_number' })
  public phoneNumber: string;

  @Column({ name: 'address' })
  public address: string;

  @Column({ name: 'img_path' })
  public imgPath: string;

  static create(data: Partial<Admin>): Admin {
      return Object.assign(new Admin(), data);
  }
}

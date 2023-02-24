import { Chat } from 'src/chats/entities/chat.entity';
import { Occupation } from 'src/occupations/entities/occupation.entity';
import { SellerRating } from 'src/seller-ratings/entities/seller-rating.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'sellers' })
export class Seller {
  @PrimaryGeneratedColumn({ name: 'id' })
  public readonly id: number;

  @Column({ name: 'name' })
  public name: string;

  @Column({ name: 'slug' })
  public slug: string;

  @Column({ name: 'whatsapp' })
  public whatsapp: string;

  @Column({ name: 'phone_number' })
  public phoneNumber: string;

  @Column({ name: 'paypal' })
  public paypal: string;

  @Column({ name: 'rating' })
  public rating: number;

  @Column({ name: 'credential', nullable: true })
  public credential: string;

  @Column({ name: 'credential_number', nullable: true })
  public credentialNumber: string;

  @Column({ name: 'instagram', nullable: true })
  public instagram: string;

  @Column({ name: 'facebook', nullable: true })
  public facebook: string;

  @Column({ name: 'short_description', nullable: true })
  public shortDescription: string;

  @Column({ name: 'description', nullable: true })
  public description: string;

  @Column({ name: 'banner', nullable: true })
  public banner: string;

  @Column({ name: 'front_image', nullable: true })
  public frontImage: string;

  @Column({ name: 'logo', nullable: true })
  public logo: string;

  @Column({ name: 'user_id' })
  public userId: number;

  @OneToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  public user: User;

  @ManyToMany(() => Occupation, { cascade: ['insert', 'update'] })
  @JoinTable({
    name: 'occupation_seller',
    joinColumn: { name: 'seller_id' },
    inverseJoinColumn: { name: 'occupation_id' },
  })
  public occupations: Occupation[];

  @OneToMany(() => Chat, (chat) => chat.seller)
  public chats: Chat[];

  @OneToMany(() => SellerRating, (sellerRating) => sellerRating.seller)
  public sellerRatings: SellerRating[];

  public clientRating: SellerRating;

  public chatWithClient: Chat;

  @CreateDateColumn({
    name: 'created_at',
  })
  public createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    select: false,
  })
  public updatedAt: Date;

  @DeleteDateColumn({
    name: 'deleted_at',
    select: false,
  })
  public deletedAt: Date;

  static create(data: Partial<Seller>): Seller {
    return Object.assign(new Seller(), data);
  }
}

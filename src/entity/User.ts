import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToMany,
} from 'typeorm';
import { ObjectType, Field, ID, Root } from 'type-graphql';
import { Chat } from './Chat';

@ObjectType()
@Entity('users')
export class User extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  firstName: string;

  @Field()
  @Column()
  lastName: string;

  @Field()
  @Column('text', { unique: true })
  email: string;

  @Field({ complexity: 3 })
  fullName(@Root() parent: User): string {
    return `${parent.firstName} ${parent.lastName}`;
  }

  @Column({ nullable: false })
  password: string;

  @OneToMany(() => Chat, (chat) => chat.userID, {
    cascade: true,
  })
  messages: Chat[];
}

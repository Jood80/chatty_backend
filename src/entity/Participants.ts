import { Entity, PrimaryGeneratedColumn, BaseEntity, ManyToOne } from 'typeorm';
import { ObjectType, Field, ID } from 'type-graphql';
import { User } from './User';
import { Room } from './Room';

@ObjectType()
@Entity('participants')
export class Participant extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.id)
  userID: User[];

  @ManyToOne(() => Room, (room) => room.id)
  roomID: Room[];
}

import { IsEmail, Length } from 'class-validator';
import { Field, InputType } from 'type-graphql';
import { IsEmailAlreadyExist } from '../validator';

@InputType()
export class CreateUserDto {
  @Field()
  @Length(1, 200)
  firstName: string;

  @Field()
  @Length(1, 200)
  lastName: string;

  @Field()
  @IsEmail()
  @IsEmailAlreadyExist({message: "this email is already in use"})
  email: string;

  @Field()
  password: string;
}

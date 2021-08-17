import {
  Arg,
  FieldResolver,
  Mutation,
  Query,
  Resolver,
  Root,
  UseMiddleware,
} from 'type-graphql';
import argon2 from 'argon2';
import { User } from '../../../entity/User';
import { CreateUserDto } from '../dto/createUserDto';
import { isAuthenticated } from '../../../middleware';

@Resolver(User)
export class RegisterResolver {
  @UseMiddleware(isAuthenticated)
  @Query(() => String)
  async hello() {
    return 'Hellloooo from registeration dude';
  }

  @FieldResolver()
  async fullName(@Root() parent: User) {
    return `${parent.firstName} ${parent.lastName}`;
  }

  @Mutation(() => User)
  async register(
    @Arg('data')
    { firstName, lastName, password, email }: CreateUserDto,
  ): Promise<User> {
    try {
      const hashedPassword = await argon2.hash(password);
      return await User.create({
        firstName,
        lastName,
        password: hashedPassword,
        email,
      }).save();
    } catch (error) {
      throw new Error(error);
    }
  }
}

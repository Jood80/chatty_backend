import {
  Arg,
  FieldResolver,
  Mutation,
  Query,
  Resolver,
  Root,
} from 'type-graphql';
import argon2 from 'argon2';
import { User } from '../../entity/User';

@Resolver(User)
export class RegisterResolver {
  @Query(() => String)
  async hello() {
    return 'Hellloooo to registeration';
  }

  @FieldResolver()
  async fullName(@Root() parent: User) {
    return `${parent.firstName} ${parent.lastName}`;
  }

  @Mutation(() => User)
  async register(
    @Arg('firstName') firstName: string,
    @Arg('lastName') lastName: string,
    @Arg('password') password: string,
    @Arg('email') email: string,
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

import { Arg, Ctx, Mutation, Resolver } from 'type-graphql';
import argon2 from 'argon2';
import { User } from '../../../entity/User';
import { MyContext } from '../../../types/MyContext';

@Resolver(User)
export class LoginResolver {
  @Mutation(() => User, { nullable: true })
  async login(
    @Arg('email') email: string,
    @Arg('password') password: string,
    @Ctx() ctx: MyContext,
  ): Promise<User | null> {
    try {
      const user = await User.findOne({ email });

      if (!user) throw new Error('No user Found');
      const validUser = await argon2.verify(user.password, password);
      console.log('ctx', ctx.req.session);
      console.log({ validUser });

      if (!validUser) return null;

      ctx.req.session.userId = user.id;

      return user;
    } catch (error) {
      throw new Error(error);
    }
  }
}

declare module 'express-session' {
  interface Session {
    userId: string;
  }
}

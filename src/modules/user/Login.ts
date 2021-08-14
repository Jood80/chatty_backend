import { Arg, Ctx, Mutation, Resolver } from 'type-graphql';
import argon2 from 'argon2';
import { User } from '../../entity/User';
import { MyContext } from '../../types/MyContext';

@Resolver(User)
export class LoginResolver {
  @Mutation(() => User)
  async login(
    @Arg('email') email: string,
    @Arg('password') password: string,
    @Ctx() ctx: MyContext,
  ): Promise<User | null> {
    try {
      const user = await User.findOne({ email });

      if (!user) return null;

      const validUser = await argon2.verify(user.password, password);

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
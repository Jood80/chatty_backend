import { MiddlewareFn } from 'type-graphql';
import { MyContext } from '../types/MyContext';

export const isAuthenticated: MiddlewareFn<MyContext> = async (
  { context },
  next,
) => {
  if (!context.req.session!.userId) {
    throw new Error('UnAuthorized');
  }

  return next();
};

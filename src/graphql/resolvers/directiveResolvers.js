const { getUserId } = require('../../helpers/auth-helper');
const { AuthError } = require('../../helpers/errors');

const directiveResolvers = {
  /**
   * Authentication middleware. Queries that require authentication can be marked with the @isAuthenticated directive.
   */
  isAuthenticated: (next, source, args, ctx) => {
    const userId = getUserId(ctx);
    if (!userId) {
      throw new AuthError('Could not authenticate token');
    }
    ctx.request.userId = userId;
    return next();
  },
};

module.exports = directiveResolvers;

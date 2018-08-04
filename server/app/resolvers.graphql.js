import { verify } from 'jsonwebtoken';
import AuthorizationError from '../errors/index';

const checkAuthAndResolve = ({ SECRET, req }, controller) => {
  const token = req.headers.authorization;
  if (!token) {
    throw new AuthorizationError({
      message: 'You must supply a JWT for authorization!',
    });
  }
  const decoded = verify(
    token,
    SECRET,
  );
  return controller.apply(this, [decoded]);
};

const checkRolesAndResolve = (
  { SECRET, req },
  expectedRoles,
  controller,
  ...params
) => {
  const token = req.headers.authorization;
  if (!token) {
    throw new AuthorizationError({
      message: 'You must supply a JWT for authorization!',
    });
  }
  const decoded = verify(
    token,
    SECRET,
  );
  const roles = decoded.user.role;
  if (!roles) {
    throw new AuthorizationError({ message: 'No roles supplied!' });
  }
  if (roles && expectedRoles.some(scope => roles.indexOf(scope) !== -1)) {
    return controller.apply(this, params);
  }
  throw new AuthorizationError({
    message: `You are not authorized. Expected roles: ${expectedRoles.join(
      ', ',
    )}`,
  });
};

export { checkAuthAndResolve, checkRolesAndResolve };

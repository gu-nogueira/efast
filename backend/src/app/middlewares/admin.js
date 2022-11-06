import Users from '../models/Users';

export default async (req, res, next) => {
  const user = await Users.findByPk(req.userId);

  if (user.role !== 'admin') {
    return res.status(401).json({ error: 'User is not an administrator' });
  }

  return next();
};

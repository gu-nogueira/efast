import jwt from 'jsonwebtoken';
import * as Yup from 'yup';

import Users from '../models/Users';

import authConfig from '../../config/auth';

class SessionsController {
  async store(req, res) {
    // ** Request validation

    const schema = Yup.object().shape({
      email: Yup.string().email().required(),
      password: Yup.string().required(),
    });
    if (!(await schema.isValid(req.body))) {
      return res
        .status(400)
        .json({ error: 'Validation fails, verify request body fields' });
    }

    const { email, password } = req.body;

    // ** Check if user exists

    const user = await Users.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    // ** Check if password matches

    if (!(await user.checkPassword(password))) {
      return res.status(401).json({ error: 'Password does not match' });
    }

    // ** Check if user is active

    if (!user.active) {
      return res.status(401).json({ error: 'User is not active' });
    }

    const { name, id } = user;

    return res.json({
      user: {
        id,
        name,
        email,
      },

      // ** Token generation

      token: jwt.sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
    });
  }
}

export default new SessionsController();

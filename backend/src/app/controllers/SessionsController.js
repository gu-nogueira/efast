import jwt from 'jsonwebtoken';
import * as Yup from 'yup';

import Users from '../models/Users';

import authConfig from '../../config/auth';

class SessionsController {

  async store(req, res) {

    // Validação de entrada com yup
    const schema = Yup.object().shape({
      email: Yup.string().email().required(),
      password: Yup.string().required(),
    });
    if (!(await schema.isValid(req.body))){
      return res.status(400).json({ error: 'Validation fails, verify request body fields' });
    }

    const { email, password } = req.body;

    // Verifica se o usuário existe no banco

    const user = await Users.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ error: 'User not found'});
    }

    // Verificação de senha método checkPassword
    if (!await user.checkPassword(password)) {
      return res.status(401).json({ error: 'Password does not match'});
    }

    // Login OK a partir daqui
    const { name, id } = user;

    // Retorna dados do usuário
    return res.json({
      user: {
        id,
        name,
        email,
      },
      // Gera token JWT
      token: jwt.sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
    })

  }

};

export default new SessionsController();

import * as Yup from 'yup';
import { Op } from 'sequelize';

import Users from '../models/Users';
import Files from '../models/Files';

import roles from '../../config/roles';

class UsersController {
  /*
   *  User list method
   */

  async index(req, res) {
    const {
      page = 1,
      perPage = 20,
      q: search,
      orderBy = 'id',
      role = 'customer',
    } = req.query;
    const filter = { [Op.iLike]: `%${search}%` };
    const searches = [];

    const checkRole = roles.find((r) => r.name == role);
    if (!checkRole) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    searches.push(
      Users.findAll({
        order: [orderBy],
        attributes: ['id', 'name', 'email', 'role'],
        where: {
          ...(search && { [Op.or]: [{ name: filter }, { email: filter }] }),
          role,
        },
        limit: perPage,
        offset: (page - 1) * perPage,
        include: [
          {
            model: Files,
            as: 'avatar',
            attributes: ['id', 'path', 'url'],
          },
        ],
      })
    );

    searches.push(
      Users.count({
        where: search
          ? {
              [Op.or]: [{ name: filter }, { email: filter }],
            }
          : undefined,
      })
    );

    const [users, usersCount] = await Promise.all(searches);

    return res.json({ rows: users, total: usersCount });
  }

  /*
   *  User search method
   */

  async show(req, res) {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: 'Missing user id' });
    }

    const user = await Users.findByPk(id, {
      attributes: ['id', 'name', 'email', 'role'],
      include: [
        {
          model: Files,
          as: 'avatar',
          attributes: ['name', 'path', 'url'],
        },
      ],
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.json(user);
  }

  /*
   *  User creation method
   */

  async store(req, res) {
    // ** Request validation

    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().email().required(),
      password: Yup.string().required().min(6),
    });
    if (!(await schema.isValid(req.body))) {
      return res
        .status(400)
        .json({ error: 'Validation fails, verify request body' });
    }

    const { email, avatar_id: avatarId } = req.body;

    // ** Check user existance

    const userExists = await Users.findOne({
      where: { email: req.body.email },
    });
    if (userExists) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // ** Check if avatar file exists

    if (avatarId) {
      const checkFileExists = await Files.findByPk(avatarId);
      if (!checkFileExists) {
        return res.status(404).json({ error: 'Avatar not found' });
      }
    }

    const { id, name, role, avatar } = await Users.create(req.body, {
      include: [
        {
          model: Files,
          as: 'avatar',
          attributes: ['id', 'path', 'url'],
        },
      ],
    });

    return res.json({
      id,
      name,
      email,
      role,
      avatar,
    });
  }

  /*
   *  User edit method
   */

  async update(req, res) {
    // ** Request validation

    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      oldPassword: Yup.string().min(6),
      password: Yup.string()
        .min(6)
        .when('oldPassword', (oldPassword, field) =>
          oldPassword ? field.required() : field
        ),
      confirmPassword: Yup.string().when('password', (password, field) =>
        password ? field.required().oneOf([Yup.ref('password')]) : field
      ),
      role: Yup.string().when('role', (role, field) =>
        role ? field.required().oneOf(() => roles.map((r) => r.name)) : field
      ),
      avatar_id: Yup.number(),
    });
    if (!(await schema.isValid(req.body))) {
      return res
        .status(400)
        .json({ error: 'Validation fails, verify request body' });
    }

    const { email, oldPassword, avatar_id: avatarId } = req.body;
    const user = await Users.findByPk(req.userId);

    // ** Check user existance if email is being changed

    if (email && email != user.email) {
      const userExists = await Users.findOne({ where: { email } });
      if (userExists) {
        return res.status(400).json({ error: 'User already exists' });
      }
    }

    // ** Check if password match

    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return res.status(401).json({ error: 'Password does not match' });
    }

    // ** Check if avatar file exists

    if (avatarId && avatarId != user.avatar_id) {
      const checkFileExists = await Files.findByPk(avatarId);
      if (!checkFileExists) {
        return res.status(404).json({ error: 'Avatar not found' });
      }
    }

    await user.update(req.body);

    const { id, name, role, avatar } = await Users.findByPk(req.userId, {
      include: [
        {
          model: Files,
          as: 'avatar',
          attributes: ['id', 'path', 'url'],
        },
      ],
    });

    return res.json({
      id,
      name,
      email,
      role,
      avatar,
    });
  }

  /*
   *  User delete method
   */

  async delete(req, res) {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: 'Missing user id' });
    }

    const user = await Users.findByPk(id, {
      include: [
        {
          model: Files,
          as: 'avatar',
          attributes: ['name', 'path', 'url'],
        },
      ],
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    await user.destroy();

    return res.json({ message: `${user.name} has been deleted` });
  }
}

export default new UsersController();

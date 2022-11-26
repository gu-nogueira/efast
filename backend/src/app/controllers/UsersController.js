import * as Yup from 'yup';
import { Op } from 'sequelize';

import Users from '../models/Users';
import Files from '../models/Files';

import defaultRoles from '../../config/roles';

import checkUserRole from '../../utils/checkUserRole';

class UsersController {
  /*
   *  User list method
   */

  async index(req, res) {
    // ** Request validation

    // const schema = Yup.object().shape({
    //   roles: Yup.array()
    //     .of(
    //       Yup.string()
    //         .strict()
    //         .oneOf(defaultRoles.map((r) => r.name))
    //     )
    //     .required(),
    // });
    // if (!(await schema.isValid(req.body))) {
    //   return res
    //     .status(400)
    //     .json({ error: 'Validation fails, verify request body' });
    // }

    const {
      roles = defaultRoles.map((r) => r.name),
      page = 1,
      perPage = 20,
      q: search,
      orderBy = 'id',
    } = req.query;
    const filter = { [Op.iLike]: `%${search}%` };
    const searches = [];

    const checkRoles = roles.every((r) => {
      return defaultRoles.some((dr) => dr.name === r);
    });
    if (!checkRoles) {
      return res.status(400).json({ error: 'Invalid roles' });
    }

    searches.push(
      Users.findAll({
        order: [orderBy],
        attributes: ['id', 'name', 'email', 'role', 'created_at'],
        where: {
          ...(search && { [Op.or]: [{ name: filter }, { email: filter }] }),
          role: {
            [Op.in]: roles,
          },
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
        where: {
          ...(search && { [Op.or]: [{ name: filter }, { email: filter }] }),
          role: {
            [Op.in]: roles,
          },
        },
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

  async register(req, res) {
    // ** Request validation

    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().email().required(),
      password: Yup.string().strict().required().min(6),
    });
    if (!(await schema.isValid(req.body))) {
      return res
        .status(400)
        .json({ error: 'Validation fails, verify request body' });
    }

    const { name, email, password } = req.body;

    // ** Check user existance

    const userExists = await Users.findOne({
      where: { email: req.body.email },
    });
    if (userExists) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const { id } = await Users.create({ name, email, password });

    return res.json({
      id,
      name,
      email,
    });
  }

  /*
   *  User creation method
   */

  async store(req, res) {
    // ** Request validation

    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().email().required(),
      password: Yup.string().strict().required().min(6),
      role: Yup.string().oneOf(defaultRoles.map((r) => r.name)),
    });
    if (!(await schema.isValid(req.body))) {
      return res
        .status(400)
        .json({ error: 'Validation fails, verify request body' });
    }

    const { email, avatar_id: avatarId, role } = req.body;

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

    // ** If has role in request, check if authenticated user has permission to create it

    if (role && !checkUserRole(role)) {
      return res.status(400).json({ error: 'Role does not exists' });
    }

    const { id, name, avatar } = await Users.create(req.body, {
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
      role: Yup.string().oneOf(defaultRoles.map((r) => r.name)),
      avatar_id: Yup.number(),
    });
    if (!(await schema.isValid(req.body))) {
      return res
        .status(400)
        .json({ error: 'Validation fails, verify request body' });
    }

    const { email, oldPassword, avatar_id: avatarId } = req.body;
    const { id: reqId } = req.params;
    const id = reqId || req.userId;
    const user = await Users.findByPk(id);

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

    // ** Check if user id matches with logged user id

    if (id != req.userId && checkUserRole(user.role, 'admin')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    await user.update(req.body);

    const { name, role, avatar } = await Users.findByPk(id, {
      include: [
        {
          model: Files,
          as: 'avatar',
          attributes: ['id', 'path', 'url'],
        },
      ],
    });

    return res.json({
      id: reqId,
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

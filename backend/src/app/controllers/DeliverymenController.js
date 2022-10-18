import * as Yup from 'yup';
import { Op } from 'sequelize';

import Deliverymen from '../models/Deliverymen';
import Files from '../models/Files';

class DeliverymenController {
  async show(req, res) {
    const deliveryman = await Deliverymen.findByPk(req.params.id, {
      attributes: ['name', 'email'],
      include: [
        {
          model: Files,
          as: 'avatar',
          attributes: ['name', 'path', 'url'],
        },
      ],
    });

    if (!deliveryman) {
      return res.status(400).json({ error: 'Deliveryman not found' });
    }

    return res.json(deliveryman);
  }

  async index(req, res) {
    const { page = 1, perPage = 20, q: search } = req.query;
    const filter = { [Op.iLike]: `%${search}%` };

    const searches = [];

    searches.push(
      Deliverymen.findAll({
        order: ['name'],
        attributes: ['id', 'name', 'email'],
        where: search
          ? {
              [Op.or]: [{ name: filter }, { email: filter }],
            }
          : undefined,
        limit: perPage,
        offset: (page - 1) * perPage,
        include: [
          {
            model: Files,
            as: 'avatar',
            attributes: ['name', 'path', 'url'],
          },
        ],
      })
    );

    searches.push(
      Deliverymen.count({
        where: search
          ? {
              [Op.or]: [{ name: filter }, { email: filter }],
            }
          : undefined,
      })
    );

    const [deliverymen, deliverymenCount] = await Promise.all(searches);

    return res.json({ rows: deliverymen, total: deliverymenCount });
  }

  async store(req, res) {
    /*
     *  Schema validation
     */

    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().email().required(),
      avatar_id: Yup.number(),
    });
    if (!(await schema.isValid(req.body))) {
      return res
        .status(400)
        .json({ error: 'Validation fails, verify request body' });
    }

    const { email, avatar_id } = req.body;

    const deliverymanExists = await Deliverymen.findOne({
      where: { email },
    });
    if (deliverymanExists) {
      return res.status(400).json({ error: 'Deliveryman already exists' });
    }

    if (avatar_id) {
      const checkFileExists = await Files.findByPk(avatar_id);
      if (!checkFileExists) {
        return res.status(400).json({ error: 'File not found' });
      }
    }

    const { name, avatar_id: avatarId } = await Deliverymen.create(req.body);

    return res.json({
      name,
      email,
      avatar_id: avatarId,
    });
  }

  async update(req, res) {
    /*
     *  Schema validation
     */

    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      avatar_id: Yup.number(),
    });
    if (!(await schema.isValid(req.body))) {
      return res
        .status(400)
        .json({ error: 'Validation fails, verify request body' });
    }

    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: 'Missing deliveryman id' });
    }

    const deliveryman = await Deliverymen.findByPk(id);
    if (!deliveryman) {
      return res.status(400).json({ error: 'Deliveryman not found' });
    }

    /*
     *  Check if email has been updated
     */

    const { email, avatar_id } = req.body;
    if (email && email !== deliveryman.email) {
      const deliverymanExists = await Deliverymen.findOne({
        where: { email: req.body.email },
      });
      if (deliverymanExists) {
        return res.status(400).json({ error: 'Deliveryman already exists' });
      }
    }

    /*
     *  Check if has avatar_id
     */

    if (avatar_id && avatar_id != deliveryman.avatar_id) {
      const checkFileExists = await Files.findByPk(req.body.avatar_id);
      if (!checkFileExists) {
        return res.status(400).json({ error: 'File does not exists' });
      }
    }

    const { name } = await deliveryman.update(req.body);
    return res.json({
      name,
      email,
      avatar_id,
    });
  }

  async delete(req, res) {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: 'Missing deliveryman id' });
    }

    const deliveryman = await Deliverymen.findByPk(id, {
      include: [
        {
          model: Files,
          as: 'avatar',
          attributes: ['name', 'path', 'url'],
        },
      ],
    });
    if (!deliveryman) {
      return res.status(400).json({ error: 'Deliveryman not found' });
    }

    deliveryman.destroy();
    return res
      .status(200)
      .json({ message: `${deliveryman.name} has been deleted` });
  }
}

export default new DeliverymenController();

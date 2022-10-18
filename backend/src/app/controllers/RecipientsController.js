import * as Yup from 'yup';
import { Op } from 'sequelize';

import Recipients from '../models/Recipients';

class RecipientsController {
  async index(req, res) {
    const { page = 1, perPage = 20, q: search } = req.query;
    const filter = { [Op.iLike]: `%${search}%` };

    const searches = [];

    searches.push(
      Recipients.findAll({
        order: [['updated_at', 'DESC']],
        attributes: [
          'id',
          'destiny_name',
          'address',
          'number',
          'complement',
          'state',
          'city',
          'cep',
        ],
        where: search
          ? { [Op.or]: [{ destiny_name: filter }, { address: filter }] }
          : undefined,
        limit: perPage,
        offset: (page - 1) * perPage,
      })
    );

    searches.push(
      Recipients.count({
        where: search
          ? { [Op.or]: [{ destiny_name: filter }, { address: filter }] }
          : undefined,
      })
    );

    const [recipients, recipientsCount] = await Promise.all(searches);

    return res.json({ rows: recipients, total: recipientsCount });
  }

  async store(req, res) {
    /*
     *  Schema validation
     */

    const schema = Yup.object().shape({
      destiny_name: Yup.string().required(),
      address: Yup.string().required(),
      // TO DO: Mudar para string
      number: Yup.number().required(),
      complement: Yup.string(),
      state: Yup.string().required().uppercase().min(2).max(2),
      city: Yup.string().required(),
      cep: Yup.string().required().min(8).max(8),
    });
    if (!(await schema.isValid(req.body))) {
      return res
        .status(400)
        .json({ error: 'Validation fails, verify request body' });
    }

    const destinyExists = await Recipients.findOne({
      where: { destiny_name: req.body.destiny_name },
    });

    if (destinyExists) {
      return res.status(400).json({ error: 'Recipient already exists' });
    }

    const { id, destiny_name, address, number, complement, state, city, cep } =
      await Recipients.create(req.body);

    return res.json({
      id,
      destiny_name,
      address,
      number,
      complement,
      state,
      city,
      cep,
    });
  }

  async update(req, res) {
    /*
     *  Schema validation
     */

    const schema = Yup.object().shape({
      destiny_name: Yup.string(),
      address: Yup.string(),
      // TO DO: Mudar para string
      number: Yup.number(),
      complement: Yup.string(),
      state: Yup.string().uppercase().min(2).max(2),
      city: Yup.string(),
      cep: Yup.string().min(8).max(8),
    });
    if (!(await schema.isValid(req.body))) {
      return res
        .status(400)
        .json({ error: 'Validation fails, please verify request body' });
    }

    const recipient = await Recipients.findByPk(req.params.id);

    if (!recipient) {
      return res.status(400).json({ error: 'Recipient not found' });
    }

    if (req.body.destiny_name != recipient.destiny_name) {
      const destinyExists = await Recipients.findOne({
        where: { destiny_name: req.body.destiny_name },
      });
      if (destinyExists) {
        return res.status(400).json({ error: 'Recipient already exists' });
      }
    }

    const { destiny_name, address, number, complement, state, city, cep } =
      await recipient.update(req.body);

    return res.json({
      destiny_name,
      address,
      number,
      complement,
      state,
      city,
      cep,
    });
  }

  async delete(req, res) {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: 'Missing recipient id' });
    }

    const recipient = await Recipients.findByPk(id);

    if (!recipient) {
      return res.status(400).json({ error: 'Recipient not found' });
    }

    await recipient.destroy();

    return res
      .status(204)
      .json({ message: `${recipient.destiny_name} has been deleted` });
  }
}

export default new RecipientsController();

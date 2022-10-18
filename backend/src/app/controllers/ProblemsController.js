import DeliveryProblems from '../models/DeliveryProblems';
import Deliveries from '../models/Deliveries';
import Recipients from '../models/Recipients';
import Deliverymen from '../models/Deliverymen';
import Files from '../models/Files';

import Queue from '../../lib/Queue';
import CancellationMail from '../jobs/CancellationMail';

import { Op } from 'sequelize';
import * as Yup from 'yup';

class ProblemsController {
  async index(req, res) {
    const { page = 1, perPage = 20, q: search } = req.query;

    /*
     *  Get all deliveries that have not been cancelled yet
     */

    const deliveries = await Deliveries.findAll({
      where: { canceled_at: null },
    });
    const deliveriesId = deliveries.map((delivery) => delivery.id);

    /*
     *  Gets the conditional query for the search
     */

    const getConditionalQuery = () => {
      if (search) {
        const numberSearch = Number(search);
        const filter = { [Op.iLike]: `%${search}%` };
        return {
          [Op.or]: [
            !isNaN(numberSearch) && { delivery_id: numberSearch },
            { description: filter },
          ],
        };
      } else {
        return { delivery_id: { [Op.in]: deliveriesId } };
      }
    };
    const conditionalQuery = getConditionalQuery();

    /*
     *  List delivery problems
     */

    const searches = [];

    searches.push(
      DeliveryProblems.findAll({
        limit: perPage,
        offset: (page - 1) * perPage,
        order: [['updated_at', 'DESC']],
        where: conditionalQuery,
        attributes: ['delivery_id', 'description', 'updated_at'],
      })
    );

    /*
     *  Count all delivery problems
     */

    searches.push(
      DeliveryProblems.count({
        where: conditionalQuery,
      })
    );

    const [deliveryProblems, deliveryProblemsCount] = await Promise.all(
      searches
    );

    // ** TO DO: Check for a better way to group problems by delivery

    // /*
    //  *  Gets the correct conditional query when filtering by something or not
    //  */

    // const problemsId = problems.map((problems) => problems.delivery_id);
    // const getConditionalQuery = () => {
    //   const defaultQuery = { id: { [Op.in]: problemsId } };
    //   if (search) {
    //     const filter = { [Op.iLike]: `%${search}%` };
    //     return {
    //       [Op.or]: [...defaultQuery, { id: filter }, { address: filter }],
    //     };
    //   } else {
    //     return defaultQuery;
    //   }
    // };
    // const query = getConditionalQuery();

    // const searches = [];

    // searches.push(
    //   Deliveries.findAll({
    //     limit: perPage,
    //     offset: (page - 1) * perPage,
    //     attributes: ['id', 'product', 'start_date'],
    //     where: {
    //       ...query,
    //       canceled_at: null,
    //     },
    //     include: [
    //       {
    //         model: Recipients,
    //         as: 'recipient',
    //         attributes: [
    //           'destiny_name',
    //           'address',
    //           'number',
    //           'complement',
    //           'state',
    //           'city',
    //           'cep',
    //         ],
    //       },
    //       {
    //         model: Deliverymen,
    //         as: 'deliveryman',
    //         attributes: ['name', 'email'],
    //         include: [
    //           {
    //             model: Files,
    //             as: 'avatar',
    //             attributes: ['name', 'path', 'url'],
    //           },
    //         ],
    //       },
    //     ],
    //   })
    // );

    // searches.push(
    //   Deliveries.count({
    //     where: {
    //       ...query,
    //       canceled_at: null,
    //     },
    //   })
    // );

    // const [deliveriesWithProblems, problemsCount] = await Promise.all(searches);

    return res.json({ rows: deliveryProblems, total: deliveryProblemsCount });
  }

  async show(req, res) {
    const { id } = req.params;

    /*
     * Check if delivery exists
     */

    const delivery = await Deliveries.findByPk(id);
    if (!delivery) {
      res.status(404).json({ error: 'Delivery not found' });
    }

    /*
     * Check if problems exists
     */

    const problems = await DeliveryProblems.findAll({
      attributes: ['id', 'description', 'updated_at'],
      where: { delivery_id: id },
    });
    if (!problems[0]) {
      return res
        .status(400)
        .json({ error: 'There is no problems for this delivery' });
    }

    return res.json(problems);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      description: Yup.string().required(),
    });
    if (!(await schema.isValid(req.body))) {
      return res
        .status(400)
        .json({ error: 'Validation fails, verify request body' });
    }

    const { id, deliveryId } = req.params;
    const { description } = req.body;
    /*
     * Check if deliveryman exists
     */

    const deliveryman = await Deliverymen.findByPk(id);
    if (!deliveryman) {
      return res.status(404).json({ error: 'Deliveryman not found' });
    }

    /*
     * Check if delivery exists
     */

    const delivery = await Deliveries.findByPk(deliveryId);
    if (!delivery) {
      return res.status(404).json({ error: 'Delivery not found' });
    }

    /*
     * Check if delivery belongs to deliveryman
     */

    if (deliveryman.id != delivery.deliveryman_id) {
      return res
        .status(400)
        .json({ error: 'You do not have permission to deliver this delivery' });
    }

    /*
     * Check if delivery has not been delivered or canceled yet
     */

    if (delivery.canceled_at != null || delivery.end_date != null) {
      return res.status(400).json({ error: 'This delivery has already ended' });
    }

    const problem = await DeliveryProblems.create({
      description: description,
      delivery_id: delivery.id,
    });

    return res.json(problem);
  }

  async delete(req, res) {
    const { id } = req.params;

    /*
     * Check if delivery exists
     */

    const delivery = await Deliveries.findByPk(id, {
      include: [
        {
          model: Recipients,
          as: 'recipient',
          attributes: [
            'destiny_name',
            'address',
            'number',
            'complement',
            'state',
            'city',
            'cep',
          ],
        },
        {
          model: Deliverymen,
          as: 'deliveryman',
          attributes: ['name', 'email'],
        },
      ],
    });
    if (!delivery) {
      return res.status(404).json({ error: 'Delivery not found' });
    }

    /*
     * Check if delivery has not been delivered or canceled yet
     */

    if (delivery.canceled_at !== null || delivery.end_date !== null) {
      return res.status(400).json({ error: 'This delivery has already ended' });
    }

    /*
     * Check if delivery really have problems
     */

    const problems = await DeliveryProblems.findAll({
      where: {
        delivery_id: delivery.id,
      },
      attributes: ['description'],
    });
    if (!problems[0]) {
      return res
        .status(400)
        .json({ error: 'There is no problems for this delivery' });
    }

    /*
     * Mapping problems description
     */

    const problemsDescription = problems.map(
      (problems) => problems.description
    );

    delivery.canceled_at = new Date();
    await delivery.save();

    await Queue.add(CancellationMail.key, { delivery, problemsDescription });
    return res.json({
      message: `Delivery nº ${delivery.id} has been canceled`,
    });
  }
}

export default new ProblemsController();

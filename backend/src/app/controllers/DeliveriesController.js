import * as Yup from 'yup';
import { Op } from 'sequelize';
import { parseISO, isBefore, getHours } from 'date-fns';

import Deliveries from '../models/Deliveries';
import Recipients from '../models/Recipients';
// import Deliverymen from '../models/Deliverymen';
import Users from '../models/Users';
import DeliveryProblems from '../models/DeliveryProblems';
import Files from '../models/Files';

import Transaction from '../../database/transaction';

import Cache from '../../lib/Cache';
import Queue from '../../lib/Queue';
import OrderMail from '../jobs/OrderMail';

class DeliveriesController {
  async index(req, res) {
    const { page = 1, perPage = 20, q: search } = req.query;

    const searches = [];

    searches.push(
      Deliveries.findAll({
        order: [['id', 'DESC']],
        attributes: ['id', 'product', 'canceled_at', 'start_date', 'end_date'],
        where: search ? { product: { [Op.iLike]: `%${search}%` } } : undefined,
        limit: perPage,
        offset: (page - 1) * perPage,
        include: [
          {
            model: Recipients,
            as: 'recipient',
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
          },
          {
            model: Users,
            as: 'deliveryman',
            attributes: ['id', 'name', 'email'],
            include: [
              {
                model: Files,
                as: 'avatar',
                attributes: ['name', 'path', 'url'],
              },
            ],
          },
          {
            model: Files,
            as: 'signature',
            attributes: ['name', 'path', 'url'],
          },
        ],
      })
    );

    searches.push(
      Deliveries.count({
        where: search ? { product: { [Op.iLike]: `%${search}%` } } : undefined,
      })
    );

    const [deliveries, deliveriesCount] = await Promise.all(searches);

    deliveries.forEach((delivery, index, arr) => {
      /*
       *  Delivery status
       */

      let status = '';

      if (delivery.dataValues.canceled_at) {
        status = 'cancelado';
      } else if (delivery.dataValues.end_date) {
        status = 'entregue';
      } else if (delivery.dataValues.start_date) {
        status = 'retirado';
      } else {
        status = 'pendente';
      }

      arr[index].dataValues.status = status;
    });

    /*
     *  Manages cached deliveries count
     */
    // const cachedCount = await Cache.get('deliveries_count');
    // // let deliveriesTotal = 0;
    // // if (cachedCount) {
    // //   deliveriesTotal = cachedCount;
    // // } else {
    // //   await Cache.set('deliveries_count', deliveriesCount);
    // //   deliveriesTotal = deliveriesCount;
    // // }

    return res.json({ rows: deliveries, total: deliveriesCount });
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      product: Yup.string().required(),
      recipient_id: Yup.number().required(),
      deliveryman_id: Yup.number().required(),
    });
    if (!(await schema.isValid(req.body))) {
      return res
        .status(400)
        .json({ error: 'Validation fails, verify request body' });
    }

    const { product, recipient_id, deliveryman_id } = req.body;

    const recipient = await Recipients.findByPk(recipient_id);
    const deliveryman = await Users.findByPk(deliveryman_id);

    if (!recipient) {
      return res.status(400).json({ error: 'Recipient not found' });
    }

    if (!deliveryman) {
      return res.status(400).json({ error: 'Deliveryman not found' });
    }

    const { id } = await Deliveries.create({
      product,
      recipient_id,
      deliveryman_id,
    });

    /*
     *  Invalidate cached deliveries count
     */

    // await Cache.invalidate('deliveries_count');

    /*
     *  E-mail queue schedule
     */

    try {
      await Queue.add(OrderMail.key, {
        product,
        recipient,
        deliveryman,
      });
    } catch (err) {
      console.error('Failed to add Queue event:', err);
    }

    return res.json({
      id,
      product,
      recipient_id,
      deliveryman_id,
    });
  }

  async update(req, res) {
    /*
     *  Schema Validation
     */

    const schema = Yup.object().shape({
      product: Yup.string(),
      recipient_id: Yup.number(),
      deliveryman_id: Yup.number(),
      start_date: Yup.date(),
      end_date: Yup.date(),
    });
    if (!(await schema.isValid(req.body))) {
      return res
        .status(400)
        .json({ error: 'Validation fails, verify request body' });
    }

    const { recipient_id, deliveryman_id, signature_id, start_date, end_date } =
      req.body;
    const delivery = await Deliveries.findByPk(req.params.id);

    /*
     *  Check if delivery exists
     */

    if (!delivery) {
      return res.status(400).json({ error: 'Delivery not found' });
    }

    /*
     *  Check if has new recipient and if it exists
     */

    if (recipient_id && recipient_id != delivery.recipient_id) {
      const recipientExists = await Recipients.findByPk(recipient_id);
      if (!recipientExists) {
        return res.status(400).json({ error: 'Recipient does not exists' });
      }
    }

    /*
     *  Check if has new deliveryman and if it exists
     */

    if (deliveryman_id && deliveryman_id != delivery.deliveryman_id) {
      const deliverymanExists = await Deliverymen.findByPk(deliveryman_id);
      if (!deliverymanExists) {
        return res.status(400).json({ error: 'Deliveryman does not exists' });
      }
    }

    /*
     *  Check if has new signature and if it exists
     */

    if (signature_id) {
      const signatureExists = await Files.findByPk(signature_id);
      if (!signatureExists) {
        return res.status(400).json({ error: 'Signature does not exists' });
      }
    }

    /*
     *  Check if has new start_date and it's conditions
     */

    // if (start_date && start_date != delivery.start_date) {
    //   if (parseISO(start_date) < 8 || parseISO(start_date) >= 18) {
    //     return res
    //       .status(400)
    //       .json({ error: 'The start date must be between 08:00 and 18:00' });
    //   }
    //   if (isBefore(parseISO(start_date), new Date())) {
    //     return res
    //       .status(400)
    //       .json({ error: 'Cannot create new orders with past date' });
    //   }
    // }

    /*
     *  If has end_date, check if delivery has been picked
     */

    if (end_date && !delivery.start_date) {
      return res
        .status(400)
        .json({ error: 'The delivery has not been picked yet' });
    }

    /*
     *  Check start_date and end_date conditions
     */

    if (start_date && end_date) {
      if (isBefore(parseISO(end_date), parseISO(start_date))) {
        return res
          .status(400)
          .json({ error: 'The end date cannot be before start date' });
      }
    }

    /*
     *  If has end_date, chehck if is after start_date
     */

    if (end_date) {
      if (isBefore(parseISO(end_date), delivery.start_date)) {
        return res
          .status(400)
          .json({ error: 'The end date cannot be before start date' });
      }
      // if (isBefore(parseISO(end_date), new Date())) {
      //   return res
      //     .status(400)
      //     .json({ error: 'Cannot end orders with past date' });
      // }
    }

    const updatedDelivery = await delivery.update(req.body);

    return res.json({
      product: updatedDelivery.product,
      recipient_id: updatedDelivery.recipient_id,
      deliveryman_id: updatedDelivery.deliveryman_id,
      signature_id: updatedDelivery.signature_id,
      start_date: updatedDelivery.start_date,
      end_date: updatedDelivery.end_date,
    });
  }

  async delete(req, res) {
    const { id } = req.params;

    /*
     *  Check if has delivery id
     */

    if (!id) {
      return res.status(400).json({ error: 'Missing delivery id' });
    }

    /*
     *  Check if delivery exists
     */

    const delivery = await Deliveries.findByPk(id);
    if (!delivery) {
      return res.status(404).json({ error: 'Delivery not found' });
    }

    /*
     *  Transaction for deleting delivery problems before delivery
     */

    await Transaction.process(async (transaction) => {
      const deliveryProblems = await DeliveryProblems.findAll(
        {
          where: { delivery_id: delivery.id },
        },
        { transaction }
      );
      if (deliveryProblems) {
        await DeliveryProblems.destroy(
          {
            where: { delivery_id: delivery.id },
          },
          { transaction }
        );
      }
      await delivery.destroy({}, { transaction });
    });

    // /*
    //  *  Invalidate cached deliveries count
    //  */

    // await Cache.invalidate('deliveries_count');

    return res
      .status(200)
      .json({ message: `Delivery nº:${delivery.id} has been deleted` });
  }
}

export default new DeliveriesController();

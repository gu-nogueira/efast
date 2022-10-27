// import Deliverymen from '../models/Deliverymen';
import Users from '../models/Users';
import Deliveries from '../models/Deliveries';
import Recipients from '../models/Recipients';
import Files from '../models/Files';

import { Op } from 'sequelize';
import {
  startOfDay,
  endOfDay,
  parseISO,
  format,
  isBefore,
  setHours,
  setMinutes,
} from 'date-fns';

class OrderController {
  async index(req, res) {
    const deliveryman = await Deliverymen.findByPk(req.params.id);
    if (!deliveryman) {
      return res.status(400).json({ error: 'Deliveryman not found' });
    }
    const { page = 1, delivered = false } = req.query;
    const deliveries = await Deliveries.findAll({
      where: {
        deliveryman_id: deliveryman.id,
        canceled_at: null,
        end_date: {
          [delivered === 'true' ? Op.not : Op.is]: null,
        },
      },
      attributes: ['id', 'product', 'start_date', 'end_date', 'created_at'],
      limit: 20,
      offset: (page - 1) * 20,
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
          model: Files,
          as: 'signature',
          attributes: ['name', 'path', 'url'],
        },
      ],
    });

    return res.json(deliveries);
  }

  async store(req, res) {
    const { id, deliveryId } = req.params;
    const { start_date: startDate } = req.query;

    /**
     * Check deliveryman id
     */

    const deliveryman = await Deliverymen.findByPk(id);
    if (!deliveryman) {
      return res.status(400).json({ error: 'Deliveryman not found' });
    }

    /**
     * Check delivery id
     */

    const delivery = await Deliveries.findByPk(deliveryId, {
      where: {
        deliveryman_id: deliveryman.id,
        canceled_at: null,
        start_date: null,
        end_date: null,
      },
    });
    if (!delivery) {
      return res.status(404).json({ error: 'Delivery not found' });
    }

    /**
     * Check start date
     */

    if (!startDate) {
      return res.status(404).json({ error: 'Invalid date' });
    }

    /**
     * Check if delivery has already been withdrawn
     */

    if (delivery.start_date != null) {
      return res
        .status(400)
        .json({ error: 'The delivery has already been withdrawn' });
    }

    /**
     * Check if delivery belongs to deliveryman
     */

    if (deliveryman.id != delivery.deliveryman_id) {
      return res
        .status(400)
        .json({ error: 'You do not have permission to deliver this delivery' });
    }

    /**
     * Check limit per day
     */

    const checkOrderLimit = await Deliveries.count({
      where: {
        deliveryman_id: deliveryman.id,
        start_date: {
          [Op.between]: [
            startOfDay(parseISO(startDate)),
            endOfDay(parseISO(startDate)),
          ],
        },
        // canceled_at: null,
      },
    });
    if (checkOrderLimit >= 5) {
      return res
        .status(400)
        .json({ error: 'Exceeded limit of 5 orders per day' });
    }

    /**
     * Check hour of end date
     */

    if (startDate && startDate != delivery.start_date) {
      const parsedDate = format(parseISO(startDate), 'HH:mm');
      const startDay = format(setMinutes(setHours(new Date(), 8), 0), 'HH:mm');
      const endDay = format(setMinutes(setHours(new Date(), 18), 0), 'HH:mm');
      // if (parsedDate < startDay || parsedDate > endDay) {
      //   return res
      //     .status(400)
      //     .json({ error: 'The start date must be between 08:00 and 18:00' });
      // }
      // if (isBefore(new Date(), parseISO(startDate))) {
      //   return res
      //     .status(400)
      //     .json({ error: 'Cannot withdraw orders in the future' });
      // }
    }

    delivery.start_date = startDate;
    await delivery.save();

    return res.json(delivery);
  }

  async update(req, res) {
    /**
     * Yup validation
     */

    const { id, deliveryId } = req.params;
    const { end_date: endDate } = req.query;
    const { signature_id: signatureId } = req.body;

    /**
     * Check deliveryman id
     */

    const deliveryman = await Deliverymen.findByPk(id);
    if (!deliveryman) {
      return res.status(400).json({ error: 'Deliveryman not found' });
    }

    /**
     * Check delivery id
     */

    const delivery = await Deliveries.findByPk(deliveryId, {
      where: {
        deliveryman_id: deliveryman.id,
        canceled_at: null,
        end_date: null,
      },
    });
    if (!delivery) {
      return res.status(404).json({ error: 'Delivery not found' });
    }

    /**
     * Check end date
     */

    if (!endDate) {
      return res.status(404).json({ error: 'Invalid date' });
    }

    /**
     * Check if delivery has already endend
     */

    if (delivery.end_date != null) {
      return res
        .status(400)
        .json({ error: 'This delivery has already been ended' });
    }

    /**
     * Check if has signature
     */

    if (!signatureId && !req.fileId) {
      return res.status(404).json({ error: 'Signature not found' });
    }

    /**
     * Check if delivery belongs to deliveryman
     */

    if (deliveryman.id != delivery.deliveryman_id) {
      return res
        .status(400)
        .json({ error: 'You do not have permission to deliver this delivery' });
    }

    /**
     * Check limit per day
     */

    const checkOrderLimit = await Deliveries.count({
      where: {
        deliveryman_id: deliveryman.id,
        end_date: {
          [Op.between]: [
            startOfDay(parseISO(endDate)),
            endOfDay(parseISO(endDate)),
          ],
        },
        // canceled_at: null,
      },
    });
    if (checkOrderLimit >= 5) {
      return res
        .status(400)
        .json({ error: 'Exceeded limit of 5 orders per day' });
    }

    /**
     * Check hour of end date
     */

    if (endDate && endDate != delivery.end_date) {
      const parsedDate = format(parseISO(endDate), 'HH:mm');
      const startDay = format(setMinutes(setHours(new Date(), 8), 0), 'HH:mm');
      const endDay = format(setMinutes(setHours(new Date(), 18), 0), 'HH:mm');
      // if (parsedDate < startDay || parsedDate > endDay) {
      //   return res
      //     .status(400)
      //     .json({ error: 'The start date must be between 08:00 and 18:00' });
      // }
      // if (isBefore(parseISO(endDate), delivery.start_date)) {
      //   return res
      //     .status(400)
      //     .json({ error: 'The end date cannot be before start date' });
      // }
      // if (isBefore(new Date(), parseISO(endDate))) {
      //   return res
      //     .status(400)
      //     .json({ error: 'Cannot delivery orders in the future' });
      // }
    }

    delivery.signature_id = signatureId || req.fileId;
    delivery.end_date = endDate;
    await delivery.save();

    return res.json(delivery);
  }
}

export default new OrderController();

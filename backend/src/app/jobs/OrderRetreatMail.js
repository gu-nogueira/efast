import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';

import Mail from '../../lib/Mail';

class OrderRetreatMail {
  /*
   *  OrderRetreatMail.key
   */

  get key() {
    return 'OrderRetreatMail';
  }

  // Job 'constructor'
  async handle({ data }) {
    const { delivery, deliveryman } = data;
    const deliveryId = delivery.id.toString().padStart(2, 0);

    console.log('Queue execution: OrderRetreatMail');

    try {
      await Mail.sendMail({
        to: `Distribuidora Efast <admin@efast.com.br>`,
        subject: `Entrega #${deliveryId} retirada.`,
        template: 'retreat',
        context: {
          deliveryman,
          delivery,
          deliveryId,
          platform: `${process.env.FRONTEND_URL}/deliveries`,
          date: format(
            parseISO(delivery.start_date),
            "'dia' dd 'de' MMMM', às' H:mm'h'",
            {
              locale: pt,
            }
          ),
        },
      });
      console.log(
        `Sending mail from retreated delivery #${deliveryId} to admin@efast.com.br.`
      );
    } catch (err) {
      console.error('Failed to send email: ', err);
    }
  }
}
export default new OrderRetreatMail();

import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';

import Mail from '../../lib/Mail';

class OrderFinishMail {
  /*
   *  OrderFinishMail.key
   */

  get key() {
    return 'OrderFinishMail';
  }

  async handle({ data }) {
    const { delivery, deliveryman } = data;
    const deliveryId = delivery.id.toString().padStart(2, 0);

    console.log('Queue execution: OrderFinishMail');

    try {
      await Mail.sendMail({
        to: `Distribuidora Efast <admin@efast.com.br>`,
        subject: `Entrega #${deliveryId} finalizada.`,
        template: 'finish',
        context: {
          deliveryman,
          delivery,
          deliveryId,
          platform: `${process.env.FRONTEND_URL}/deliveries`,
          date: format(
            parseISO(delivery.end_date),
            "'dia' dd 'de' MMMM', às' H:mm'h'",
            {
              locale: pt,
            }
          ),
        },
      });
      console.log(
        `Sending mail from finished delivery #${deliveryId} to admin@efast.com.br.`
      );
    } catch (err) {
      console.error('Failed to send email: ', err);
    }
  }
}
export default new OrderFinishMail();

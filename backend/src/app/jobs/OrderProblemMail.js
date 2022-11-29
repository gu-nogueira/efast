import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';

import Mail from '../../lib/Mail';

class OrderProblemMail {
  /*
   *  OrderProblemMail.key
   */

  get key() {
    return 'OrderProblemMail';
  }

  async handle({ data }) {
    const { delivery, deliveryman, problem } = data;
    const deliveryId = delivery.id.toString().padStart(2, 0);

    console.log('Queue execution: OrderProblemMail');

    try {
      await Mail.sendMail({
        to: `Distribuidora Efast <admin@efast.com.br>`,
        subject: `Novo problema registrado para a entrega #${deliveryId}.`,
        template: 'problem',
        context: {
          deliveryman,
          delivery,
          deliveryId,
          platform: `${process.env.FRONTEND_URL}/deliveries`,
          date: format(
            parseISO(new Date().toISOString()),
            "'dia' dd 'de' MMMM', às' H:mm'h'",
            {
              locale: pt,
            }
          ),
          problem,
        },
      });
      console.log(
        `Sending mail from new problem in delivery #${deliveryId} to admin@efast.com.br.`
      );
    } catch (err) {
      console.error('Failed to send email: ', err);
    }
  }
}
export default new OrderProblemMail();

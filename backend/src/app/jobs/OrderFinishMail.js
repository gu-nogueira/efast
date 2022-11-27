import { format } from 'date-fns';
import pt from 'date-fns/locale/pt';

import Mail from '../../lib/Mail';

class OrderMail {
  /*
   *  OrderMail.key
   */

  get key() {
    return 'OrderFinishMail';
  }

  // Job 'constructor'
  async handle({ data }) {
    const { delivery, product, recipient, deliveryman } = data;

    console.log('Queue execution: OrderMail');

    try {
      await Mail.sendMail({
        to: `Distribuidora Efast <admin@efast.com.br>`,
        subject: `Entrega #${delivery.id.toString().padStart(2, 0)} realizada!`,
        template: 'finish',
        context: {
          deliveryman: deliveryman.name,
          recipient: recipient.destiny_name,
          product: product,
          address: recipient.address,
          number: recipient.number,
          city: recipient.city,
          state: recipient.state,
          date: format(new Date(), "'dia' dd 'de' MMMM', às' H:mm'h'", {
            locale: pt,
          }),
        },
      });
      console.log(`Sending mail from new delivery to: ${deliveryman.email}`);
    } catch (err) {
      console.error('Failed to send email: ', err);
    }
  }
}
export default new OrderMail();

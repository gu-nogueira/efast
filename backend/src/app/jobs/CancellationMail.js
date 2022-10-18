import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';

import Mail from '../../lib/Mail';

class CancellationMail {
  /*
   *  CancellationMail.key
   */

  get key() {
    return 'CancellationMail';
  }

  async handle({ data }) {
    const { delivery, problemsDescription } = data;

    console.log('Queue execution: CancellationMail');

    try {
      await Mail.sendMail({
        to: `${delivery.deliveryman.name} <${delivery.deliveryman.email}>`,
        subject: 'Entrega cancelada',
        template: 'cancellation',
        context: {
          deliveryman: delivery.deliveryman.name,
          id: delivery.id,
          recipient: delivery.recipient.destiny_name,
          product: delivery.product,
          problems: problemsDescription,
          address: delivery.recipient.address,
          number: delivery.recipient.number,
          city: delivery.recipient.city,
          state: delivery.recipient.state,
          date: format(
            parseISO(delivery.canceled_at),
            "'dia' dd 'de' MMMM', às' H:mm'h'",
            {
              locale: pt,
            }
          ),
        },
      });
      console.log(
        `Sending mail for new delivery to: ${delivery.deliveryman.email}`
      );
    } catch (err) {
      console.error('Failed to send email: ', err);
    }
  }
}
export default new CancellationMail();

import Sequelize, { Model } from 'sequelize';

class Deliveries extends Model {
  static init(sequelize) {
    super.init(
      {
        product: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        canceled_at: {
          type: Sequelize.DATE,
          allowNull: true,
        },
        start_date: {
          type: Sequelize.DATE,
          allowNull: true,
        },
        end_date: {
          type: Sequelize.DATE,
          allowNull: true,
        },
        delivered: {
          type: Sequelize.VIRTUAL,
          get() {
            return !!this.end_date;
          },
        },
      },
      {
        sequelize,
      }
    );
    return this;
  }

  // ** Foreign keys

  static associate(models) {
    this.belongsTo(models.Recipients, {
      foreignKey: 'recipient_id',
      as: 'recipient',
    });
    this.belongsTo(models.Users, {
      foreignKey: 'deliveryman_id',
      as: 'deliveryman',
    });
    this.belongsTo(models.Files, {
      foreignKey: 'signature_id',
      as: 'signature',
    });
  }
}

export default Deliveries;

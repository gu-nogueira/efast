'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.removeColumn('deliveries', 'deliveryman_id', {
          transaction: t,
        }),
        queryInterface.addColumn(
          'deliveries',
          'deliveryman_id',
          {
            type: Sequelize.INTEGER,
            references: { model: 'users', key: 'id' },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
            allowNull: true,
          },
          { transaction: t }
        ),
      ]);
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.removeColumn('deliveries', 'deliveryman_id', {
          transaction: t,
        }),
        queryInterface.addColumn(
          'deliveries',
          'deliveryman_id',
          {
            type: Sequelize.INTEGER,
            references: { model: 'deliverymen', key: 'id' },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
            allowNull: true,
          },
          { transaction: t }
        ),
      ]);
    });
  },
};

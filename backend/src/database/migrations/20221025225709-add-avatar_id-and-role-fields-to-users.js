'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.addColumn(
          'users',
          'avatar_id',
          {
            type: Sequelize.INTEGER,
            references: { model: 'files', key: 'id' },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
            allowNull: true,
          },
          { transaction: t }
        ),
        queryInterface.addColumn(
          'users',
          'role',
          {
            type: Sequelize.ENUM,
            values: ['admin', 'deliveryman', 'customer'],
            allowNull: false,
            defaultValue: 'customer',
          },
          { transaction: t }
        ),
      ]);
    });
  },

  down: async (queryInterface) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.removeColumn('users', 'avatar_id', {
          transaction: t,
        }),
        queryInterface.removeColumn('users', 'role', {
          transaction: t,
        }),
      ]);
    });
  },
};

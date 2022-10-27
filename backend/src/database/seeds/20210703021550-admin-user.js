const bcrypt = require('bcryptjs');

module.exports = {
  up: (QueryInterface) => {
    return QueryInterface.bulkInsert(
      'users',
      [
        {
          name: 'Distribuidora Efast',
          email: 'admin@efast.com.br',
          password_hash: bcrypt.hashSync('123456', 8),
          role: 'admin',
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  down: () => {},
};

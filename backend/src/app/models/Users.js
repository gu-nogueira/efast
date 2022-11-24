import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcryptjs';

class Users extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          primaryKey: true,
        },
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        password: Sequelize.VIRTUAL,
        password_hash: Sequelize.STRING,
        role: {
          type: Sequelize.ENUM,
          values: ['admin', 'deliveryman', 'customer', 'requester'],
          defaultValue: 'requester',
        },
      },
      {
        sequelize,
      }
    );

    // ** Only generates the hash if the password has been changed

    this.addHook('beforeSave', async (user) => {
      if (user.password) {
        user.password_hash = await bcrypt.hash(user.password, 8);
      }
    });

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Files, { foreignKey: 'avatar_id', as: 'avatar' });
  }

  // ** Compare password hash in database

  checkPassword(password) {
    return bcrypt.compare(password, this.password_hash);
  }
}

export default Users;

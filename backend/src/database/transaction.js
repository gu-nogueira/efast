class Transaction {
  constructor() {
    this.sequelize;
  }

  setSequelize(sequelize) {
    this.sequelize = sequelize;
  }

  getSequelize() {
    return this.sequelize;
  }

  async process(transactionFn, data) {
    const transaction = await this.sequelize.transaction();

    try {
      console.log('Processing transaction...');
      const result = await transactionFn(transaction, data);
      await transaction.commit();
      console.log('Transaction succeeded!');
      if (result) {
        return result;
      }
    } catch (err) {
      await transaction.rollback();
      console.error('Transaction failed:', err);
    }
  }
}

export default new Transaction();

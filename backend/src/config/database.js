module.exports = {
  dialect: 'postgres',
  host: process.env.DB_HOST ?? '144.22.238.109',
  username: process.env.DB_USER ?? 'postgres',
  password: process.env.DB_PASS ?? 'docker',
  database: process.env.DB_NAME ?? 'efast',
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true,
  },
};

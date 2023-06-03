class HealthCheckController {
  async show(_, res) {
    return res.json({ status: 'ok' });
  }
}

export default new HealthCheckController();

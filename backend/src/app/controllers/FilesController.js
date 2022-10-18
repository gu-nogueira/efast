import Files from '../models/Files';

class FilesController {
  async store(req, res) {
    const { file } = req;

    if (!file) {
      return res.status(400).json({ error: 'File is required' });
    }

    /*
     *  'originalName' & 'fileName' are handled by multerConfig
     */

    const { originalname: name, filename: path } = file;

    const fileRegister = await Files.create({
      name,
      path,
    });
    return res.json(fileRegister);
  }
}

export default new FilesController();

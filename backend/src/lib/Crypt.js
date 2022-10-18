import 'dotenv/config';

import crypto from 'crypto';

import cryptConfig from '../config/crypt';

class Crypt {
  encrypt(text) {
    const cipher = crypto.createCipheriv(
      cryptConfig.algorithm,
      Buffer.from(cryptConfig.key, 'hex'),
      Buffer.from(cryptConfig.iv, 'hex')
    );
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return encrypted.toString('hex');
  }

  decrypt(text) {
    const encryptedText = Buffer.from(text, 'hex');
    const decipher = crypto.createDecipheriv(
      cryptConfig.algorithm,
      Buffer.from(cryptConfig.key, 'hex'),
      Buffer.from(cryptConfig.iv, 'hex')
    );
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
  }
}

export default new Crypt();

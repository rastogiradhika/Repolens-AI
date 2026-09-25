import bcrypt from 'bcryptjs';

const SALT_ROUNDS = parseInt(process.env.BCRYPT_ROUNDS || '10', 10);

export const passwordService = {
  async hash(password) {
    return bcrypt.hash(password, SALT_ROUNDS);
  },

  async verify(password, hash) {
    return bcrypt.compare(password, hash);
  }
};

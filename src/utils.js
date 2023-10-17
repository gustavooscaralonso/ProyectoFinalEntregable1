import bcrypt from 'bcrypt';

const createHash = password =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(10));

const isValidPassword = (plainPassword, hashedPassword) =>
  bcrypt.compareSync(plainPassword, hashedPassword);

export {
  createHash,
  isValidPassword,
};
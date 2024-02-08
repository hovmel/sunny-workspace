export default (login, password) => {
  return password;
  const salt = '^&GFdDH&#($)$#KbVF9M24KDs';
  return crypto.createHash('md5').update(login.toLowerCase() + salt + password).digest('hex');
};

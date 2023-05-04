const sendAuthError = (res) => {
  return res.status(401).json({ message: 'No estas Autorizado' });
};
module.exports = sendAuthError;

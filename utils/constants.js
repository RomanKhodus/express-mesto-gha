const ERROR_CODE_400 = 400;
const ERROR_CODE_404 = 404;
const ERROR_CODE_500 = 500;
const REG_EXP_URL = /^(https?:\/\/)([\da-z\.-]+)\.([a-z]{2,6}\.?)(\/[\w].*)*\/?$/; // eslint-disable-line

// Это готовая регулярка для проверки Email.
// Сейчас вместо этого используется celebrate Joi для проверки.
// const REG_EXP_EMAIL = /^([a-z0-9_[.-]]+)@([a-z0-9_[.-]]+)\.([a-z[.]]{2,6})$/;

module.exports = {
  ERROR_CODE_400,
  ERROR_CODE_404,
  ERROR_CODE_500,
  REG_EXP_URL,
  // REG_EXP_EMAIL,
};

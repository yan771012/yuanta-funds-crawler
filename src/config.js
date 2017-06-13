import multiconfig from '@nukr/multiconfig';

export default multiconfig({
  url: `https://www.yuantafunds.com/b1/b2_2.aspx`,
  schedule: '0 0 */1 * *',
  db: {
    host: '127.0.0.1',
    user: 'root',
    password: '123456',
    db: 'YanTest',
    charset: 'utf8'
  }
});

/**
 * Created by Chen Jyun Yan on 2016/7/4.
 */

const config = {
  url: `https://www.yuantafunds.com/b1/b2_2.aspx`,
  log: {
    logFilePath: '',
    maxLogSize: 20480,
    backups: 100,
    level: 'info'
  },
  gcloud: {
    keyFile: ``,
    projectId: ``
  },
  bigQuery: {
    dataset: ``,
    table: ``
  }
};

export default config;

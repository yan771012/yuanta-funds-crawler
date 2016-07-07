/**
 * Created by Chen Jyun Yan on 2016/6/26.
 */

import fetch   from 'node-fetch';
import cheerio from 'cheerio';
import gcloud  from 'gcloud';
import log4js from 'log4js';

import func    from './function';
import config  from './config';

log4js.configure({
  appenders: [
    {
      type: 'file',
      filename: config.log.logFilePath,
      maxLogSize: config.log.maxLogSize,
      backups: config.log.backups,
      category: 'yuanta-funds'
    }
  ]
});

let LOG = log4js.getLogger('yuanta-funds');

let projInfo = {
  projectId: config.gcloud.projectId,
  keyFilename: config.gcloud.keyFile
};

let bigQuery = gcloud.bigquery(projInfo);

async function main() {
  try {
    LOG.info(`yuanta-funds-crawler start ...`);
    let startTime = new Date();
    let data = await fetchFundsData();
    let dataset = bigQuery.dataset(config.bigQuery.dataset);
    let table = dataset.table(config.bigQuery.table);

    table.insert(data, (err, insertErrors) => {
      if (err) {
        LOG.error(`BigQuery insert failed.`, err);
      } else {
        if (insertErrors.length == 0) {
          LOG.info(`BigQuery insert success.`);
        }
      }
      let executionTimeSec = (new Date - startTime) / 1000;
      LOG.info(`yuanta-funds-crawler end. Execution Time: ${executionTimeSec} Sec.`);
    });

  } catch (e) {
    LOG.fatal(`Process Crash...`, e);
  }
}

async function fetchFundsData() {
  let res = await fetch(config.url);
  let html = await res.text();
  let $ = cheerio.load(html);
  let $fundsTrs = $('#div_NavSummary').find('tr.mytd3, tr.mytd5');
  let fundsArr = [];
  $fundsTrs.each((i, elm) => {
    let fundObj = {};
    $(elm).find('td').each((tdi, td) => {
      switch (tdi) {
        case 0:
          fundObj['name'] = $(td).find('a').text();
          break;
        case 1:
          fundObj['updatedOn'] = $(td).find('span').text();
          break;
        case 2:
          fundObj['value'] = $(td).find('span').text();
          break;
        case 5:
          fundObj['maxValue'] = $(td).find('span').text();
          break;
        case 6:
          fundObj['minValue'] = $(td).find('span').text();
          break;
      }
    });
    fundsArr.push(fundObj);
  });

  LOG.info(`Fetch ${fundsArr.length} funds.`);

  let formatArr = [];
  for (let i = 0; i < fundsArr.length; i++) {
    let fund = fundsArr[i];
    let formatFund = await func.formatInsertData(fund);

    if (formatFund) {
      formatArr.push(formatFund);
    } else {
      LOG.warn(`Fund format failed.`, fund);
    }
  }

  LOG.info(`Format ${fundsArr.length} funds.`);

  return formatArr;
}


main();

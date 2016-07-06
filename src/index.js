/**
 * Created by Chen Jyun Yan on 2016/6/26.
 */

import fetch   from 'node-fetch';
import cheerio from 'cheerio';
import gcloud  from 'gcloud';

import func    from './function';
import config  from './config';

let projInfo = {
  projectId: config.gcloud.projectId,
  keyFilename: config.gcloud.keyFile
};

let bigquery = gcloud.bigquery(projInfo);

async function main() {
  let data = await fetchFundsData();
  let dataset = bigquery.dataset(config.bigQuery.dataset);
  let table = dataset.table(config.bigQuery.table);

  table.insert(data, (err, insertErrors, apiResponse) => {
    if (err) {
      console.log(`err> `, err);
    } else {
      if (insertErrors.length == 0) {
        console.log(`apiResponse> `, apiResponse);
      }
    }
  });
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

  let formatArr = [];
  for (let i = 0; i < fundsArr.length; i++) {
    let fund = fundsArr[i];
    let formatFund = await func.formatInsertData(fund);

    if (formatFund) {
      formatArr.push(formatFund);
    }
  }

  return formatArr;
}

main();
/**
 * Created by Chen Jyun Yan on 2016/6/26.
 */

import fetch    from 'node-fetch';
import cheerio  from 'cheerio';
import func     from './function';
import db       from './database';
import config   from './config';
import MARIASQL from 'mariasql';
import schedule from 'node-schedule';


async function main() {
  let client;
  try {
    console.log(`yuanta-funds-crawler start ...`);
    client = new MARIASQL(config.db);
    let allFundInfo = await db.getAllFundInfo(client);
    let startTime = new Date();
    let fundsData = await fetchFundsData();

    let insertFundData = [];
    let updateFundInfo = [];

    for (let i = 0; i < fundsData.length; i++) {
      let fund = fundsData[i];
      let fundInfo = await getFundInfo(client, allFundInfo, fund);

      insertFundData.push({
        fund_info_id: fundInfo.id,
        value: fund.value,
        updated_on: fund.updated_on
      });

      if (fund.max_value !== fundInfo.max_value || fund.min_value !== fundInfo.min_value) {
        updateFundInfo.push({
          id: fundInfo.id,
          max_value: fund.max_value,
          min_value: fund.min_value
        })
      }
    }

    await db.insertFundData(client, insertFundData);
    await db.updateFundInfo(client, updateFundInfo);

    let executionTimeSec = (new Date - startTime) / 1000;
    client.end();
    console.log(`yuanta-funds-crawler end. Execution Time: ${executionTimeSec} Sec.`);

  } catch (e) {
    console.error(`Process Crash...`, e);
    if (client) {
      client.end();
    }
  }
}

async function getFundInfo(client, allFundInfo, fund) {

  for (let i = 0; i < allFundInfo.length; i++) {
    if (fund.name === allFundInfo[i].name) {
      return allFundInfo[i];
    }
  }

  let fundInfo = await db.insertFundInfo(client, fund.name, fund.max_value, fund.min_value);
  allFundInfo.push(fundInfo);
  return fundInfo;
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
          fundObj['updated_on'] = $(td).find('span').text();
          break;
        case 2:
          fundObj['value'] = $(td).find('span').text();
          break;
        case 5:
          fundObj['max_value'] = $(td).find('span').text();
          break;
        case 6:
          fundObj['min_value'] = $(td).find('span').text();
          break;
      }
    });
    fundsArr.push(fundObj);
  });

  console.log(`Fetch ${fundsArr.length} funds.`);

  let formatArr = [];
  for (let i = 0; i < fundsArr.length; i++) {
    let fund = fundsArr[i];
    let formatFund = await func.formatInsertData(fund);

    if (formatFund) {
      formatArr.push(formatFund);
    } else {
      console.error(`Fund format failed.`, fund);
    }
  }

  console.log(`Format ${fundsArr.length} funds.`);

  return formatArr;
}
console.log(JSON.stringify(config, null, 4));
schedule.scheduleJob(config.schedule, main);

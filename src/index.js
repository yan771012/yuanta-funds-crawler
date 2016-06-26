/**
 * Created by Chen Jyun Yan on 2016/6/26.
 */

import fetch   from 'node-fetch';
import cheerio from 'cheerio';

async function main() {

    let res = await fetch(`https://www.yuantafunds.com/b1/b2_2.aspx`);
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

    console.log(JSON.stringify(fundsArr, null, '\t'));
}

main();
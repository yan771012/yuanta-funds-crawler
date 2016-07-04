/**
 * Created by Chen Jyun Yan on 2016/7/4.
 */

import {Validator} from 'jsonschema';
import {
  htmlObjectSchema,
  formatObjectSchema
} from './schema';

async function formatInsertData(obj = {}) {
  let v = new Validator();
  let vResult = v.validate(obj, htmlObjectSchema);
  let formatObj = {};
  if (vResult.errors.length == 0) {
    formatObj['name'] = obj.name.trim();
    formatObj['value'] = await parseValue(obj.value.trim());
    formatObj['maxValue'] = await parseValue(obj.maxValue.trim());
    formatObj['minValue'] = await parseValue(obj.minValue.trim());

    let updateDate = new Date(obj.updatedOn.trim());
    if (await isDateObject(updateDate)) {
      formatObj['updatedOn'] = updateDate.getTime();
    }

  }

  vResult = v.validate(formatObj, formatObjectSchema);

  return (vResult.errors.length == 0) ? formatObj : undefined;
}

async function parseValue(str = '') {
  let v = parseFloat(str);

  if (isNaN(v)) {
    return undefined;
  } else {
    return v;
  }
}

async function isDateObject(date) {
  if (Object.prototype.toString.call(date) !== "[object Date]") {
    return false;
  }

  return !isNaN(date.getTime());
}

export default {
  formatInsertData: formatInsertData
}
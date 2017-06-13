
function insertFundData(client, fundData) {
  if (fundData.length <= 0) {
    return;
  }
  console.log(`Insert Fund Data(${fundData.length})...`);
  let strArr = fundData.map(fd => {
    return `(${fd.fund_info_id}, ${fd.value}, ${fd.updated_on})`
  });

  return new Promise((resolve, reject) => {
    let comm = `INSERT INTO fund_data(fund_info_id, value, updated_on) VALUES ${strArr.join(',')}`;

    client.query(comm, null, {useArray: true}, function (err, rows) {
      if (err)
        reject(err);
      resolve();
    });
  });
}

function getAllFundInfo(client) {
  return new Promise((resolve, reject) => {
    let comm = `SELECT id, name, max_value, min_value FROM fund_info`;

    client.query(comm, null, {useArray: true}, function (err, rows) {
      if (err)
        reject(err);

      rows.pop();

      let arr = [];

      rows.forEach(d => {
        arr.push({id: d[0], name: d[1], max_value: d[2], min_value: d[3]});
      });

      resolve(arr);
    });
  });
}

function insertFundInfo(client, name, max_value, min_value) {
  console.log(`Insert New Fund... ${name}`);
  return new Promise((resolve, reject) => {
    let comm = `INSERT INTO fund_info(name, max_value, min_value) VALUES ("${name}", ${max_value}, ${min_value})`;

    client.query(comm, null, {useArray: true}, function (err, rows) {
      if (err)
        reject(err);

      let id = rows.info.insertId;

      resolve({id, name, max_value, min_value});
    });
  });
}

function updateFundInfo(client, fundInfo) {
  if (fundInfo.length <= 0) {
    return;
  }
  console.log(`Update Fund Info(${fundInfo.length})...`);
  let strArr = fundInfo.map(fi => {
    return `(${fi.id}, ${fi.max_value}, ${fi.min_value})`
  });

  return new Promise((resolve, reject) => {
    let comm = `INSERT INTO fund_info(id, max_value, min_value) VALUES ${strArr.join(',')} ON DUPLICATE KEY UPDATE max_value=VALUES(max_value),min_value=VALUES(min_value);`;

    client.query(comm, null, {useArray: true}, function (err, rows) {
      if (err)
        reject(err);
      resolve();
    });
  });
}


export default {
  getAllFundInfo,
  insertFundInfo,
  updateFundInfo,
  insertFundData
};
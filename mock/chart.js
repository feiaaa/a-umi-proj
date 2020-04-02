// import {parse} from "url";

const Mock = require('mockjs') // 需要引入

function getChart(req, res, u) {
  let realUrl = u;

  if (!realUrl || Object.prototype.toString.call(realUrl) !== '[object String]') {
    realUrl = req.url;
  }

  // const { current = 1, pageSize = 10 } = req.query;
  // const params = parse(realUrl, true).query;
  const re=Mock.mock({
    'data|7': [{
      'value|0-1200.1-2':1,
    }],
  })
  // console.log(params,'[2-')
  // let dataSource = [...tableListDataSource].slice((current - 1) * pageSize, current * pageSize);
  //
  // if (params.sorter) {
  //   const s = params.sorter.split('_');
  //   dataSource = dataSource.sort((prev, next) => {
  //     if (s[1] === 'descend') {
  //       return next[s[0]] - prev[s[0]];
  //     }
  //
  //     return prev[s[0]] - next[s[0]];
  //   });
  // }
  //
  // if (params.status) {
  //   const status = params.status.split(',');
  //   let filterDataSource = [];
  //   status.forEach(s => {
  //     filterDataSource = filterDataSource.concat(
  //       dataSource.filter(item => {
  //         if (parseInt(`${item.status}`, 10) === parseInt(s.split('')[0], 10)) {
  //           return true;
  //         }
  //
  //         return false;
  //       }),
  //     );
  //   });
  //   dataSource = filterDataSource;
  // }
  //
  // if (params.name) {
  //   dataSource = dataSource.filter(data => data.name.includes(params.name || ''));
  // }

  const result = {
    ...re,
    success: true,
  };
  return res.json(result);
}
function postChart(req, res) {
  const result=Mock.mock({
    'data|7': [{
      'value|0-1200.1-2':1,
    }],
    'code':'000000'
  })
  return res.json(result);
}
export default {
  'GET /api/chart': getChart,
  'POST /api/chart': postChart,
};

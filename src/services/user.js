import request from '@/utils/request';
// import fetch from "fetch"
const currentUser={"name":"Serati Ma","avatar":"https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png","userid":"00000001","email":"antdesign@alipay.com","signature":"海纳百川，有容乃大","title":"交互专家","group":"蚂蚁金服－某某某事业群－某某平台部－某某技术部－UED","tags":[{"key":"0","label":"很有想法的"},{"key":"1","label":"专注设计"},{"key":"2","label":"辣~"},{"key":"3","label":"大长腿"},{"key":"4","label":"川妹子"},{"key":"5","label":"海纳百川"}],"notifyCount":12,"unreadCount":11,"country":"China","geographic":{"province":{"label":"浙江省","key":"330000"},"city":{"label":"杭州市","key":"330100"}},"address":"西湖区工专路 77 号","phone":"0752-268888888"}
export async function query() {
  return request('/api/users');
}
export async function queryCurrent() {
  return currentUser//request('/api/currentUser');
}
export async function queryNotices() {
  return request('/api/notices');
}

// export async function queryTif() {
//   return request('/tiff.js/images/logluv-3c-16b.tiff',{
//     method: 'GET',
//     responseType:"arrayBuffer",
//     parseResponse: false
//   })
//   // .then(res=>{
//   //   console.log(res,"=res in user");
//   //   return res.arrayBuffer()
//   // });
// }
export async function queryTif() {
  return fetch('/tiff.js/images/minisblack-1c-16b.tiff',{
    method: 'GET',
    responseType:"arrayBuffer",
  })
  .then(res=>{
    console.log(res,"=res in user1");
    return res.arrayBuffer()
  });
}


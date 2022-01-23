import React  from "react";
import { history, connect, Dispatch } from 'umi';
import styles from "./index.less";

const fs = require("fs");
const LuckyExcel = require('luckyexcel');

const LuckySheet =({dispatch,user})=>{
  const click1= ()=>{
    console.log("=18")
    var p1 = new Promise(function (resolve, reject) {
      // fs.readFile("En-name.xlsx", function(err, data) {
      //   if (err) throw err;
      //
      //   // LuckyExcel.transformExcelToLucky(data, function(exportJson, luckysheetfile){
      //   //   // Get the worksheet data after conversion
      //   //   console.log(exportJson,"=15")
      //   //   resolve(data)
      //   // });
      //
      // });
      fs.readFile("1.txt", 'utf8', function (err, data) {
        if (err) {
          // 失败了，承诺容器中的任务失败了
          // console.log(err)
          // 把容器的 Pending 状态变为 Rejected

          // 调用 reject 就相当于调用了 then 方法的第二个参数函数
          reject(err)
        } else {
           console.log("data=",data)
          // 承诺容器中的任务成功了
          // console.log(data)
          // 把容器的 Pending 状态改为成功 Resolved
          // 也就是说这里调用的 resolve 方法实际上就是 then 方法传递的那个 function
          resolve(data)
        }
      })


    })

  }
  return (<div>
    <button key="upload_pic" type="primary" onClick={()=>click1()}>click</button>
    <div id="luckysheet" className={styles.lucky}>

    </div>

  </div>)
}
export default connect(({ user }) => ({
  user
}))(LuckySheet)



import React, { useState, useEffect } from 'react';
import {Upload,Button} from 'antd';
const AdmZip = require('adm-zip');
import newUnZipArchive from '@/utils/read/lib/UnZipArchive';
// import {UnZipArchive} from '@/utils/read/lib/UnZipArchive.js';

const UploadShow = () => {

  const [uploadData, setUploadData] = useState([]);// 上传文件列表
  const [zipList, setZipList] = useState('');// zip列表
  const [fileSize,setFileSize]=useState(100);// count走到的终点，文件体积越大，轮询越多
  useEffect(() => {
    
  },[1])
  console.log(JSON.stringify(uploadData),'=uploadData')


  const beforeOCR=(file,fileList)=>{
    const fileType = [
      'application/octet-stream',
      'application/x-zip-compressed',
      'application/zip'
    ];
    const index = file.name.lastIndexOf("\.");
    const name  = file.name.substring(0, index);
    let regExp = /[a-zA-Z0-9_]{4,15}$/g
    let match = regExp.exec(name)

    const isFormat = fileType.indexOf(file.type) >= 0;
    const isLt200M = file.size / 1024 / 1024 < 200;
    return new Promise((resolve,reject) => {
      // setTimeout(() => {
        console.log(newUnZipArchive,'-newUnZipArchive')
      // 此处校验文件层次 start
      const un = new newUnZipArchive(file);
      console.log(un,'=un')
      
      un.getData( function() {
          //获取所以的文件和文件夹列表;
          var arr = un.getEntries();
          //拼接字符串
          var str = "";
          console.log(arr,'=arr')
          // for(var i=0; i<arr.length; i++ ) {
          //     //点击li的话直接下载文件;
          //     str += "<li οnclick=download('"+arr[i]+"')>"+arr[i]+"</li>"
          // };
          // $("#dir").html( str );
      });

      reject()
      // 此处校验文件层次 end


      // 校验名字
      if(match === null) {
        message.error('文件名称仅支持字母数字下划线下划线,5-16字节');
        reject()
      }
      // 格式和体积正确走校验表头api
      if (isFormat && isLt200M) {
        setFileSize(fileSize+file.size/ 1024 / 50)
        reject()// resolve(file,fileList)
      }
      else {
        message.error('文件格式不对或体积过大');
        reject()
      }
    });
  }

  const customRequest =async (detail) => {
    console.log(detail,'-detail in custom')
  }
  return (
    <div>
      <Upload data={()=>({batchId:formData.batchId,companyCode:formData.companyCode,params:'step1OCR'})}
                  action={'/ocr/upload_async_ian/'} beforeUpload={beforeOCR}
                  customRequest={customRequest}
                  showUploadList={false}
            // onRemove={(file)=>{removeFile(file)}}
                  fileList={uploadData}
                  // progress={progress}
                  multiple={true}
          ><Button key="upload_excel" type="primary">导入影像件</Button></Upload>
          {zipList}
    </div>
  )
};
export default UploadShow;

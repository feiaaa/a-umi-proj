

import React, { useState, useEffect } from 'react';
import {Upload,Button,message} from 'antd';
import _ from 'lodash';
var JSZip = require("jszip");



const UploadShow = () => {

  const [uploadData, setUploadData] = useState([]);// 上传文件列表
  const [zipList, setZipList] = useState([]);// zip列表

  const checkFolder=(file)=>{
    var dateBefore = new Date();
    return new Promise(function(resolve, reject) { 
      JSZip.loadAsync(file)                                   // 1) read the Blob
        .then(function(zip) {
            var dateAfter = new Date();
            console.log(" (loaded in " + (dateAfter - dateBefore) + "ms)")
          let newZipList=_.cloneDeep(zipList);
            zip.forEach(function (relativePath, zipEntry) {  // 2) print entries
              newZipList=newZipList.concat([zipEntry.name]);
              console.log(zipEntry.name,'=zip');
            });
            setZipList(newZipList)
          resolve(true)

        }, function (e) {
          console.log('error:'+ f.name)
          resolve(false)
            
        });

    }) 
  }

  const beforeOCR=async(file,fileList)=>{
    // todo:// file.type只能检测出通用的类型，比如txt,JPEG,png 之类
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
    // // 此处校验文件层次 start
    const isFolder=await checkFolder(file);
    console.log(isFolder,'=folder')
    // 此处校验文件层次 end
    return new Promise((resolve,reject) => {      
      // 校验名字
      if(match === null) {
        message.error('文件名称仅支持字母数字下划线下划线,5-16字节');
        reject()
      }
      
      // 格式和体积正确走校验表头api
      if (isFormat && isLt200M && isFolder) {
        message.success('全部通过')
        resolve(file,fileList)
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
      <Upload data={()=>({batchId:'123456',params:'step1OCR'})}
                  action={'/api/fakeUploadUrl/'} beforeUpload={beforeOCR}
                  customRequest={customRequest}
                  showUploadList={false}
            // onRemove={(file)=>{removeFile(file)}}
                  fileList={uploadData}
                  // progress={progress}
                  multiple={true}
          ><Button key="upload_excel" type="primary">导入影像件</Button></Upload>
          {zipList.join('\n')}
    </div>
  )
};
export default UploadShow;

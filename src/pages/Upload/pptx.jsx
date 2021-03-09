

import React, { useState, useEffect } from 'react';
import {Upload,Button,message} from 'antd';
import _ from 'lodash';
import pptParse from 'pptx-parser'



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
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'application/vnd.ms-powerpoint'
    ];
    
    const isFormat = file.name.indexOf('pptx')>=0;//fileType.indexOf(file.type) >= 0;
    const isLt200M = file.size / 1024 / 1024 < 200;

    console.log(isFormat,isLt200M,'=49')
  
    return new Promise((resolve,reject) => {      
      
      // 格式和体积正确走校验表头api
      if (isFormat && isLt200M ) {
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
  
    const file=detail.file;
    const pptJson = await pptParse(file)
    // todo 此段要精简
    const pptObj=(pptJson.slides||[]).map((slide,index)=>{
      const slideRes=slide.pageElements.filter(page=>(page.shape && page.shape.text&& page.shape.text.paragraphs)).find(page=>{
        const pageRes=page.shape.text.paragraphs.filter(para=>{
          const res=(para.textSpans||[]).find(el=>el.hasOwnProperty('textRun') )
          return res && res.textRun &&res.textRun.content;          
        })
        return Array.isArray(pageRes) && pageRes.length>0
      })
      return slideRes.shape.text.paragraphs.map(para=>{
        const res=(para.textSpans||[]).find(el=>el.hasOwnProperty('textRun') )
        return {index,word:res && res.textRun &&res.textRun.content};        
      })

    })
    console.log(pptObj,'===89',_.flatMap(pptObj))
  }
  return (
    <div>
      <h3>使用了pptx-parser 工具，把pptx转化问json</h3>
      <p>不是ppt</p>
      <Upload data={()=>({batchId:'123456',params:'step1OCR'})}
                  action={'/api/fakeUploadUrl/'} beforeUpload={beforeOCR}
                  customRequest={customRequest}
                  showUploadList={false}
            // onRemove={(file)=>{removeFile(file)}}
                  fileList={uploadData}
                  // progress={progress}
                  multiple={true}
          ><Button key="upload_excel" type="primary">导入pptx</Button></Upload>
          {zipList.join('\n')}
    </div>
  )
};
export default UploadShow;

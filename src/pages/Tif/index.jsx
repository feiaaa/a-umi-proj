

import React, { useState, useEffect,useRef } from 'react';
import {Upload,Button,message,Card} from 'antd';
import { connect, Dispatch } from 'umi';
import _ from 'lodash';

import fetch from "fetch";

import TIFFParser from "@/utils/tif.js"
// import Tiff from "@/utils/tif.min.js"
var Tiff = require('tiff.js');
var fs = require('fs');

import pic_png from "./images/2.jpg";
// import pic_tiff from "./images/1.tif";
const url2="http://localhost:8000/static/2.afff2939.jpg";
const url="http://seikichi.github.io/tiff.js/images/minisblack-1c-16b.tiff";
// "https://hcp-am-test.cn-sh2.ufileos.com/000205%2Feyr3749347%2F._ESS00216023?UCloudPublicKey=I-tYi63l6eGP_WGBG7laEBdQDBMnXHr2_HeKUwE6&Signature=PYPW5CpmZGtcVMQjMrZMFW8XKX0%3D&Expires=1636366069"
var JSZip = require("jszip");



const ShowTif = ({dispatch,user}) => {

  const [uploadData, setUploadData] = useState([]);// 上传文件列表
  const [zipList, setZipList] = useState([]);// zip列表
  const [src,setSrc]=useState("");
  const tifRef = useRef(null);
  
  const handleChange=()=>{

  }
  const customRequest =async (detail) => {
    console.log(detail,'-detail in custom')
    const {file}=detail;
    let isTif = ['image/tiff', 'image/tif'].includes(file.type);
    if(isTif){
      let fr = new FileReader();
      let _file = file;
      fr.onloadend = function (e) {
          console.log(e,'=36')
        var image = new Tiff({ buffer: e.target.result });
          _file.url = image.toDataURL();
      }
      fr.readAsArrayBuffer(_file);
}
    
  }
  const removeFile=(file)=>{
    console.log(uploadData,'=64',file)
    // setUploadData([])
  }
  
  // 查看影像件
  const transformArrayBufferToBase64 =(buffer)=> {
    var binary = '';
    var bytes = new Uint8Array(buffer);
    for (var len = bytes.byteLength, i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }

  // 换请求
  const showTif=async ()=>{
    console.log("showTIf");
    dispatch({
      type: 'tif/queryTif',
      payload:{},
      callback:(buffer)=>{
        console.log(buffer,"=res")

        var tiff = new Tiff({buffer: buffer});
        var canvas = tiff.toCanvas();
        var width = tiff.width();
        var height = tiff.height();
        var src = canvas.toDataURL();
        
        // base64 failed
        // var src=transformArrayBufferToBase64(buffer);
        // console.log(src,"=src")
        // setSrc(`data:image/jpeg;base64,${src}`)

        
        


      }
    })
    

    
  }

  const showTifXHR=()=>{
  //   return new Promise(function (resolve) {
  //     var xhr = new XMLHttpRequest();
  //     xhr.onload = function () {
  //         var reader = new FileReader();
  //         reader.onloadend = function () {
  //             resolve(reader.result);
  //         };
  //         reader.readAsDataURL(xhr.response);
  //     };
  //     xhr.open("GET", url);
  //     xhr.responseType = "arraybuffer";
  //     xhr.send();
  // }).then(res=>{
  //   console.log(res,"=res111")
  // })
      var xhr = new XMLHttpRequest();
      xhr.responseType = 'arraybuffer';
      xhr.open('GET', url);
      xhr.onload = (e) => {
        console.log(xhr.response,"=repsonse =55")
        var tiff = new Tiff({ buffer: xhr.response });
        var canvas = tiff.toCanvas();
        const src = canvas.toDataURL();
      };
      xhr.send();
  }

  const showTifNodejs=()=>{
    var documentRoot = '/src/pages/Tif/images/';
    var file = documentRoot + '2.jpg';
    console.log(url);
    
    fs.readFile(file, function(err,data){
      console.log(data,"=data")
    })
      // const reader = new FileReader();
      // reader.onload = (e) => {
      //   const data = e.target.result;
        
      // };
      // reader.readAsBinaryString(file);

  }
  return (
    <div>
      <h2>file-type 工具的用途</h2>
      <img src={src} width="100" height="100" alt="none"/>
      <h3>展示图片</h3>
      
          <img src={pic_png} height="200" width="200"/>
          {/* <img src={pic_tif} height="200" width="200"/> */}
          <div ref={tifRef}></div>
          <Button key="upload_pic" type="primary" onClick={()=>showTif()}>show tif</Button>
          <Button key="upload_pic" type="primary" onClick={()=>showTifXHR()}>show tif xhr</Button>
      
          <Button key="upload_pic" type="primary" onClick={()=>showTifNodejs()}>show tif nodejs</Button>
      
      <Card title={'上传图片'}>
      <Upload
                  action={'/api/fakeUploadUrl/'} 
                  customRequest={customRequest}
                  showUploadList={false}
                  onRemove={(file)=>{removeFile(file)}}
                  onChange={handleChange}
                  fileList={uploadData}
                  // progress={progress}
                  accept=".jpg, .jpeg, .png, .tif ,.itff"
                 
          ><Button key="upload_pic" type="primary">导入图片</Button></Upload>
        </Card>  
    </div>
  )
};
export default connect(({ user }) => ({
  user
}))(ShowTif);

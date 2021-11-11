

import React, {  } from 'react';

import _ from 'lodash';


import UTIF from  '@/utils/utif.js';

import tiffFile from "./images/minisblack-1c-16b.tiff";//"./images/monet.tif";
const url="http://seikichi.github.io/tiff.js/images/minisblack-1c-16b.tiff";


const ShowTif = () => {

  const showTifXHR=()=>{
    

    var xhr = new XMLHttpRequest();
    xhr.open("GET", tiffFile);
    xhr.responseType = "arraybuffer";
    xhr.onload = function (e){
      var arrayBuffer = this.response;
      var dataUrl = UTIF.bufferToURI(arrayBuffer); //replaceIMG
      document.getElementById("img").src=dataUrl;
    }
    xhr.send();
    // document.getElementById("img").src=dataUrl;
  }


  return (
    <div>
      <h2>UTIF 工具的用途</h2>
      <img src={tiffFile} id="img" width="100" height="100"/>
      <button key="upload_pic" type="primary" onClick={()=>showTifXHR()}>show tif xhr</button>
    </div>
  )
};
export default ShowTif;



import React, { useState, useEffect } from 'react';
import BasicChart from '../../components/BasicEcharts/BasicEcharts.tsx'
import {barOption,datas} from './echartOption.js'
import { queryEcharts} from './service';

const Charts = () => {

  const [barData, setBarData] = useState([]);
  useEffect(() => {
    queryEcharts().then(res=>{
      console.log(res,'=res')
      setBarData(res.data)
    })

  },[1])
  console.log(JSON.stringify(barOption({
    dataSource:datas
  })),'===12',barData)
  return (
    <div>
      <BasicChart
        style={{
          width: '100%',
          height: 600,
        }}
        option={
          barOption({
          dataSource:barData
        })
        }
      />
    </div>
  )
};
export default Charts;

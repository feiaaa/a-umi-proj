

import React, { useState, useEffect } from 'react';
import BasicChart from '../../components/BasicEcharts/BasicEcharts.tsx'
import Echarts from 'echarts-for-react'
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

  const onFilterClickSingle=(chart)=>{
    console.log(chart,'=chart')
    alert(JSON.stringify(chart.data))
  }
  const onclickSingle = {
    'click': onFilterClickSingle.bind(this)
  }
  return (
    <div>
      <h3>使用自己组装的basicChart</h3>
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
      <h3>使用echart for react,含点击事件</h3>
      <Echarts 
      option={
          barOption({
          dataSource:barData
        })}
      style={{
        width: '100%',
        height: 600,
      }}
      onEvents={onclickSingle}
      />
      {/* <BasicChart
        style={{
          width: '100%',
          height: 600,
        }}
        option={
          barOption({
          dataSource:barData
        })
        }
      /> */}
    </div>
  )
};
export default Charts;



import React, { useState, useEffect } from 'react';
import { query} from './service';
const Charts = () => {

  const [barData, setBarData] = useState([]);
  
  useEffect(() => {
    query().then(res=>{
      setBarData(res.data)
    })

  },[])
  
  return (
    <div>
      <h3>输出</h3>
      {JSON.stringify(barData)}
    </div>
  )
};
export default Charts;

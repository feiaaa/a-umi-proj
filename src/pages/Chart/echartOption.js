export const datas=[120, 200, 150, 80, 70, 110, 130];
export const barOption=({dataSource=[]}={})=>({
  xAxis: {
    type: 'category',
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  },
  yAxis: {
    type: 'value'
  },
  series: [{
    data:dataSource,
    type: 'bar'
  }]
});



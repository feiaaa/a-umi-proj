import echarts from 'echarts';

const chartTypeEnum={
    PIE: 'pie',
    LINE: 'line',
    BAR: 'bar',
    DUALBAR: 'dual_bar',
    STACKBAR: 'stack_bar',
    SCATTER: 'scatter',
    AREA: 'area'
}

const chartMap = {
    'line' : 'xy',
    'bar':'xy',
    'area':'xy',
    'horizontal_bar':'xy',
    'sunburst':'sb',
    'scatter':'yy',
    'bubble':'yy',
    'treemap':'tree',
    'pie':'pie',
    'donut':'pie',
    'radar':'radar',
    'dual_line':'xyy',
    'dual_bar':'xyy',
    'ratio_bar': 'rxy',
    'stack_bar':'xxy',
    'geo':'geo',
}

const suggestChartType = (dims,meas,selectedTime)=>{
    if(meas.length===0 && dims.length>0){
        return chartTypeEnum.PIE;
    }
    let s = new Set();
    meas.forEach(mea=>s.add(mea.meta.dataType));
    if(dims.length===1){
        if(meas.length ===1){
            return chartTypeEnum.BAR;
        }else{
            switch(s.size){
                case 1:
                    return chartTypeEnum.LINE;
                case 2:
                     if(meas.length===2){
                        return chartTypeEnum.SCATTER;
                    }
                    return chartTypeEnum.DUALBAR;
                case 3:
                    if(meas.length===3)
                    return chartTypeEnum.BUBBLE;
                default:
                    break;
            }
        }
    }
    return chartTypeEnum.BAR;
}


const getColorPalette = ()=>{
    return [
            '#51C9D6','#C0E6EB','#348189','#64ADB5','#99A8E4',
            '#87A782','#8D9CB8','#CCE8C0','#80DDA0','#76A787',
    ];
}




const riskColorPalette = [
    [
        {offset: 0, color: 'rgba(147,226,224,0.75)'},
        {offset: 1, color: 'rgba(147,226,224,0.75)'}
    ]
]

const highlighColorPalette = [
    [
        // {offset: 0, color: 'rgba(187,63,29,0.75)'},
        // {offset: 1, color: 'rgba(209,102,73,0.75)'}
        {offset: 0, color: '#519ADB'},
        {offset: 1, color: '#97C2EB'}
    ],
    [
        {offset: 0, color: 'rgba(210,122,30,0.75)'},
        {offset: 1, color: 'rgba(245,176,105,0.75)'}
    ],
    [
        {offset: 0, color: 'rgba(241,194,22,0.75)'},
        {offset: 1, color: 'rgba(244,216,113)'}
    ],
    [
        {offset: 0, color: 'rgba(147,226,224,0.75)'},
        {offset: 1, color: 'rgba(147,226,224,0.75)'}
    ],
]


const getGradientPattern=(direction,cp=riskColorPalette)=>{
    let offset = [0,1,0,0];
    switch(direction){
        case "bottom-right":
            offset = [1, 1, 0, 0];
            break;
        case "bottom":
            offset = [0, 1, 0, 0];
            break;
        case "left":
            offset = [0, 0, 1, 0];
            break;
        default:
            break;
    }
    return cp.map(c=>{
        let ec = echarts;
        const func = (x,y,x2,y2,colorStops)=>{
            return new echarts.graphic.LinearGradient(x,y,x2,y2,colorStops);
        };
        return func.apply(this,[...offset,c]);
    });
}


const registerTheme = ()=>{
    const colorPalette = getColorPalette();

    const theme = {

        color: colorPalette,
        backgroundColor:'#ffffff',
        title: {
            textStyle: {
                fontWeight: 'normal',
                color: '#404040'
            }
        },

        legend:{
            type:"scroll"
        },

        visualMap: {
            color:['#C1232B','#FCCE10']
        },

        toolbox: {
            iconStyle: {
                normal: {
                    borderColor: colorPalette[0]
                }
            }
        },

        tooltip: {
            // backgroundColor: 'rgba(50,50,50,0.5)',
            axisPointer : {
                type : 'line',
                lineStyle : {
                    color: '#519ADB',
                    type: 'dashed'
                },
                crossStyle: {
                    color: '#519ADB'
                },
                shadowStyle : {
                    color: 'rgba(200,200,200,0.3)'
                }
            },
            backgroundColor: '#1A1C1E',
            padding: [12, 15, 10, 15],
            textStyle: {
              fontSize: 12,
              // 文字左对齐
              align: 'left',
              fontWeight: 'light'
            }
        },

        dataZoom: {
            dataBackgroundColor: 'rgba(181,195,52,0.3)',
            fillerColor: 'rgba(181,195,52,0.2)',
            handleColor: '#519ADB'
        },

        categoryAxis: {
            axisLine: {
                lineStyle: {
                    color: '#ccc'
                }
            },
            splitLine: {
                show: false
            }
        },

        valueAxis: {
            axisLine: {
                show: false
            },
            splitArea : {
                show: false
            },
            splitLine: {
                lineStyle: {
                    color: ['#ccc'],
                    type: 'dashed'
                }
            }
        },

        timeline: {
            lineStyle: {
                color: '#519ADB'
            },
            controlStyle: {
                normal: {
                    color: '#519ADB',
                    borderColor: '#519ADB'
                }
            },
            symbol: 'emptyCircle',
            symbolSize: 3
        },

        line: {
            itemStyle: {
                normal: {
                    borderWidth:2,
                    borderColor:'#fff',
                    lineStyle: {
                        width: 3
                    }
                },
                emphasis: {
                    borderWidth:0
                }
            },
            symbol: 'circle',
            symbolSize: 3.5
        },

        candlestick: {
            itemStyle: {
                normal: {
                    color: '#C1232B',
                    color0: '#B5C334',
                    lineStyle: {
                        width: 1,
                        color: '#C1232B',
                        color0: '#B5C334'
                    }
                }
            }
        },

        graph: {
            color: colorPalette
        },

        map: {
            label: {
                normal: {
                    textStyle: {
                        color: '#C1232B'
                    }
                },
                emphasis: {
                    textStyle: {
                        color: 'rgb(100,0,0)'
                    }
                }
            },
            itemStyle: {
                normal: {
                    areaColor: '#ddd',
                    borderColor: '#eee'
                },
                emphasis: {
                    areaColor: '#fe994e'
                }
            }
        },

        gauge: {
            axisLine: {
                lineStyle: {
                    color: [[0.2, '#B5C334'],[0.8, '#519ADB'],[1, '#C1232B']]
                }
            },
            axisTick: {
                splitNumber: 2,
                length: 5,
                lineStyle: {
                    color: '#fff'
                }
            },
            axisLabel: {
                textStyle: {
                    color: '#fff'
                }
            },
            splitLine: {
                length: '5%',
                lineStyle: {
                    color: '#fff'
                }
            },
            title : {
                offsetCenter: [0, -20]
            }
        }
    };


    ['bottom-right','bottom','left'].forEach(d=>{

        const riskColorPalette = getGradientPattern(d,highlighColorPalette);
        const risktheme = {

            color: riskColorPalette,
            backgroundColor:'#ffffff',
            title: {
                textStyle: {
                    fontWeight: 'normal',
                    color: '#404040'
                }
            },
    
            legend:{
                type:"scroll"
            },
    
            visualMap: {
                color:['#C1232B','#FCCE10']
            },
    
            toolbox: {
                iconStyle: {
                    normal: {
                        borderColor: riskColorPalette[0]
                    }
                }
            },
    
            tooltip: {
                // backgroundColor: 'rgba(50,50,50,0.5)',
                axisPointer : {
                    type : 'line',
                    lineStyle : {
                        color: '#519ADB',
                        type: 'dashed'
                    },
                    crossStyle: {
                        color: '#519ADB'
                    },
                    shadowStyle : {
                        color: 'rgba(200,200,200,0.3)'
                    }
                },
                backgroundColor: '#1A1C1E',
                padding: [12, 15, 10, 15],
                textStyle: {
                  fontSize: 12,
                  // 文字左对齐
                  align: 'left',
                  fontWeight: 'light'
                }
            },
    
            dataZoom: {
                dataBackgroundColor: 'rgba(181,195,52,0.3)',
                fillerColor: 'rgba(181,195,52,0.2)',
                handleColor: '#519ADB'
            },
    
            categoryAxis: {
                axisLine: {
                    lineStyle: {
                        color: '#ccc'
                    }
                },
                axisLabel:{
                    color:'#ccc'
                },
                splitLine: {
                    show: false
                }
            },
    
            valueAxis: {
                axisLine: {
                    show: false
                },
                splitArea : {
                    show: false
                },
                axisLabel:{
                    color:'#ccc'
                },
                axisTick:{
                    lineStyle:{
                        color:'#ccc'
                    }
                },
                splitLine: {
                    lineStyle: {
                        color: ['#ccc'],
                        type: 'dashed'
                    }
                }
            },
    
            timeline: {
                lineStyle: {
                    color: '#519ADB'
                },
                controlStyle: {
                    normal: {
                        color: '#519ADB',
                        borderColor: '#519ADB'
                    }
                },
                symbol: 'emptyCircle',
                symbolSize: 3
            },
    
            line: {
                itemStyle: {
                    normal: {
                        borderWidth:2,
                        borderColor:'#fff',
                        lineStyle: {
                            width: 3,
                        }
                    },
                    emphasis: {
                        borderWidth:0
                    }
                },
                lineStyle:{
                    color:'#519ADB'
                },
                symbolSize:10,
                symbol:"emptyCircle",
            },
    
            candlestick: {
                itemStyle: {
                    normal: {
                        color: '#C1232B',
                        color0: '#B5C334',
                        lineStyle: {
                            width: 1,
                            color: '#C1232B',
                            color0: '#B5C334'
                        }
                    }
                }
            },
    
            graph: {
                color: riskColorPalette
            },
    
            map: {
                label: {
                    normal: {
                        textStyle: {
                            color: '#C1232B'
                        }
                    },
                    emphasis: {
                        textStyle: {
                            color: 'rgb(100,0,0)'
                        }
                    }
                },
                itemStyle: {
                    normal: {
                        areaColor: '#ddd',
                        borderColor: '#eee'
                    },
                    emphasis: {
                        areaColor: '#fe994e'
                    }
                }
            },
    
            gauge: {
                axisLine: {
                    lineStyle: {
                        color: [[0.2, '#B5C334'],[0.8, '#519ADB'],[1, '#C1232B']]
                    }
                },
                axisTick: {
                    splitNumber: 2,
                    length: 5,
                    lineStyle: {
                        color: '#fff'
                    }
                },
                axisLabel: {
                    textStyle: {
                        color: '#fff'
                    }
                },
                splitLine: {
                    length: '5%',
                    lineStyle: {
                        color: '#fff'
                    }
                },
                title : {
                    offsetCenter: [0, -20]
                }
            }
        };
    
        echarts.registerTheme('risktheme'+d, risktheme);
        
    })
    // echarts.registerTheme('risktheme', risktheme);
    echarts.registerTheme('infographic', theme);
}


const themeMap={
    'line' : 'bottom',
    'bar':'bottom',
    'area':'bottom',
    'horizontal_bar':'left',

    'scatter':'bottom-right',
    'bubble':'bottom-right',

    'pie':'bottom-right',
    'donut':'bottom-right',

    'dual_line':'bottom',
    'dual_bar':'bottom',
    'ratio_bar': 'bottom',
    'stack_bar':'bottom'
}

const suggestTheme = (chartType)=>{
    return themeMap[chartType];
}


export {
    suggestChartType, getColorPalette,registerTheme, chartMap,
    suggestTheme, getGradientPattern, highlighColorPalette
};
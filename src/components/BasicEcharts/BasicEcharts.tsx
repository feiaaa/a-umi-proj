import React, { PureComponent, CSSProperties, ReactNode, createRef, RefObject } from 'react';
import echarts, { ECharts, EChartOption } from 'echarts';

import _ from 'lodash';
import styles from './BasicEcharts.less';
// import china from '@/mapdata/china.json';
// import world from '@/mapdata/world.json';

// import guangdong from '@/mapdata/geometryProvince/44.json';
import { registerTheme } from '../../utils/ChartTypeUtils.js';
// echarts.registerMap('china', china);
// echarts.registerMap('world', world);
// echarts.registerMap('guangdong', guangdong);
echarts.registerTheme('infographic',registerTheme());


interface PropsIF {
  option: EChartOption;
  className?: string;
  style?: CSSProperties;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onClick?(config: any): void;
}

/**
 * Echarts 组件
 *
 * option 必须为 对象
 */
export default class BasicEcharts extends PureComponent<PropsIF> {
  static registerMap(mapName: string, geoJson: object, specialAreas?: object | undefined): void {
    echarts.registerMap(mapName, geoJson, specialAreas);
  }

  chartDom: RefObject<HTMLDivElement> = createRef();

  echartsInstance?: ECharts;

  onresize = _.debounce((): void => {
    if (this.echartsInstance) {
      this.echartsInstance.resize();
    }
  }, 500);

  componentDidMount() {
    const { option, onClick } = this.props;
    this.echartsInstance = echarts.init(this.chartDom.current as HTMLDivElement);
    this.echartsInstance.setOption(option);

    // 绑定 resize event
    /**
     * 本应该针对 容器 div 的大小变化, 重置 chart 大小
     * 但是容器div大小变化, 目前百分之90以上是因为浏览器大小改变
     * 其次监听div大小变化方案, 兼容性有问题, 或者比较麻烦
     * 暂时使用 window.resize 方案
     */
    window.addEventListener('resize', this.onresize, false);

    if (onClick) {
      this.echartsInstance.on('click', onClick);
    }
  }

  componentWillUnmount() {
    // 取消绑定 resize event
    window.removeEventListener('resize', this.onresize);
    // echarts 实例销毁
    if (this.echartsInstance && !this.echartsInstance.isDisposed()) {
      this.echartsInstance.off('click');
      this.echartsInstance.dispose();
      this.echartsInstance = undefined;
    }
  }

  render(): ReactNode {
    const { className, style, option } = this.props;

    if (this.echartsInstance) {
      this.echartsInstance.clear();
      // 当更新 option 的时候, 更新 echarts
      this.echartsInstance.setOption(option);
    }

    return (
      <div
        className={className ? `${className} ${styles.basicEcharts}` : styles.basicEcharts}
        style={{ width: '20%', ...style }}
        ref={this.chartDom}
      >
        抱歉, 您的浏览器不支持canvas
      </div>
    );
  }
}

import React, { FC } from 'react';
import {Select, Space} from 'antd';
import Trigger from 'rc-trigger';

const { Option } = Select;

interface TriggerProps {
  action:string[],
  popAlign?:{points:string[],offset:number[]},
  data:number[] //| {"name":string,value:"string"}[] 
}

const CheckboxTrigger: FC<TriggerProps> = (props) => {
    const {
        action,
        popAlign,
        data
      } = props;
      const children=data.map(i=><Option key={i.toString(36) + i}>{i.toString(36) + i}</Option>)
 
    return (
      <Trigger
          action={action}
          popup={<span>popup</span>}
          popupAlign={popAlign}>
            <Space
              direction="vertical"
              style={{
                width: '100%',
              }}
            >
                <Select mode="multiple" style={{width:"300px"}} size={"large"} maxTagCount={3}>{children}</Select>
            </Space>
      </Trigger>
 
    )
}
export default CheckboxTrigger;
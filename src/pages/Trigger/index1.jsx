
import React from 'react';
import {Select, Space} from 'antd';

// jsx version

const { Option } = Select;
const children = [];
for (let i = 10; i < 36; i++) {
  children.push(<Option key={i.toString(36) + i}>{i.toString(36) + i}</Option>);
}


class TriggerBox extends React.Component {
    render() {
      return (
          <div>
              <Space
      direction="vertical"
      style={{
        width: '100%',
      }}
    >
         <Select mode="multiple" style={{width:"300px"}} size={"small"} maxTagCount={3}>{children}</Select>
    </Space>
             
      </div>
    
      )
    }
  }

export default TriggerBox;

import React, { Children, Component } from 'react';
import Trigger from 'rc-trigger';
import {Select, Space} from 'antd';

const { Option } = Select;
const children = [];
for (let i = 10; i < 36; i++) {
  children.push(<Option key={i.toString(36) + i}>{i.toString(36) + i}</Option>);
}


// class InputPopup extends React.Component {
//     componentDidMount() {
//       this.props.onMount();
//     }

    
  
//     render() {
//       return (
//         <div>
//           <input ref={this.props.inputRef} type="text" />
//         </div>
//       );
//     }
//   }

class TriggerBox extends React.Component {
    // handlePopupMount() {
    //     this.input.focus(); // error, this.input is undefined.
    //   }
  //     <Trigger
    //     action={['click']}
    //     popup={<InputPopup inputRef={node => this.input = node} onMount={this.handlePopupMount} />}
    //   >
    //     <button>click</button>
    //   </Trigger>
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
             
        {/* <Trigger
        action={['click']}
        popup={<div>{children}</div>}
        popupAlign={{
          points: ['tl', 'bl'],
          offset: [0, 3]
        }}
      >
        <Select mode="multiple" style={{width:"100px"}} />
      </Trigger> */}
      </div>
    
      )
    }
  }

export default TriggerBox;
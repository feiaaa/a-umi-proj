

import React, { useState, useMemo,useEffect } from 'react';
import {Upload,Button,message,Tabs,Table,Modal,Form,Input,InputNumber,Card,Col,Row} from 'antd';
import { connect, Dispatch } from 'umi';
import { ExclamationCircleOutlined } from '@ant-design/icons';

import {columns, editSingle, queryList} from '@/services/yby'
import _, { values } from 'lodash';
import pptParse from 'pptx-parser'
var pinyin = require("pinyin");


const { TabPane } = Tabs;

const Pptx = ({dispatch,word,listing}) => {
  const {list,filter}=word;

  const [uploadData, setUploadData] = useState([]);// 上传文件列表
  // const [zipList, setZipList] = useState([]);// zip列表
  const [wordList,setList]=useState(list);//字母列表
  const [addVisible,setSingleAddVisible]=useState(false);//添加弹窗
  const [courseObj,setCourseObj]=useState({});//课程对象
  const [tab,setTab]=useState('1');//标签页key

  const [form] = Form.useForm();
  const queryList=(params={page:0,course:-1})=>{
    if(addVisible)setSingleAddVisible(false)// 关闭弹窗
    dispatch({
      type: 'word/fetch',
      payload:params,
    })
  }

  useEffect(()=>{
    queryList()
  },[1])

  useMemo(()=>{
    setList(list);
    setCourseObj(_.groupBy(list,'courseNo'))
  },[JSON.stringify(list[0])])

  const changeTab=(e)=>{
    console.log(e,'==tab 41'); 
    setTab(e)   
  }

  const onFinish=(values)=>{
    //todo
    console.log(values,'=values')
    dispatch({
      type: 'word/addSingle',
      payload:values,
      callback:(res)=>{
        queryList()
      }
    })
  }
  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };
  const gridLayout={
    xs:24,sm:24,md:12,lg:8, xl:8,
  }

  const setPinyin=(e)=>{
    const value=e.target.value;
    var reg = new RegExp("[\\u4E00-\\u9FFF]+","g");
　　if(reg.test(value)){
      const py=pinyin(value).join(" ")
      form.setFieldsValue({ pinyin: py,fristLetter:py.slice(0,1).toUpperCase() });
      return;
    }else{
      form.setFieldsValue({ pinyin: null,fristLetter:null });
      return;
    }
    

    
  }

  const beforeOCR=async(file,fileList)=>{
    // todo:// file.type只能检测出通用的类型，比如txt,JPEG,png 之类
    const fileType = [
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'application/vnd.ms-powerpoint'
    ];
    
    const isFormat = file.name.indexOf('pptx')>=0;//fileType.indexOf(file.type) >= 0;
    const isLt200M = file.size / 1024 / 1024 < 200;

    const index = file.name.lastIndexOf("\.pptx");
    const name  = file.name.substring(0, index);
    let regExp = /^[0-9]+$/g;
    let match = regExp.exec(name)


    console.log(isFormat,isLt200M,'=49')
  
    return new Promise((resolve,reject) => {      
      if(match === null) {
        message.error('ppt名称仅支持数字');
        reject()
      }
      // 格式和体积正确走校验表头api
      if (isFormat && isLt200M ) {
        message.success('全部通过')
        resolve(file,fileList)
      }
      else {
        message.error('文件格式不对或体积过大');
        reject()
      }
    });
  }

  const customRequest =async (detail) => {
    console.log(detail,'-detail in custom')
  
    const file=detail.file;
    const pptJson = await pptParse(file)
    // todo 此段要精简
    const pptObj=(pptJson.slides||[]).map((slide,index)=>{
      const slideRes=slide.pageElements.filter(page=>(page.shape && page.shape.text&& page.shape.text.paragraphs)).find(page=>{
        const pageRes=page.shape.text.paragraphs.filter(para=>{
          const res=(para.textSpans||[]).find(el=>el.hasOwnProperty('textRun') )
          return res && res.textRun &&res.textRun.content;          
        })
        return Array.isArray(pageRes) && pageRes.length>0
      })
      return slideRes.shape.text.paragraphs.map(para=>{
        const res=(para.textSpans||[]).find(el=>el.hasOwnProperty('textRun') )
        return res && res.textRun &&res.textRun.content;        
      })

    })
    const index = file.name.lastIndexOf("\.pptx");
    const name  = file.name.substring(0, index);

    const array=_.flatMap(pptObj).map(el=>{
      const py=pinyin(el).join(" ")
      return {
        word:el,pinyin: py,fristLetter:py.slice(0,1).toUpperCase(),courseNo:name

      }
    })
    // 上传
    dispatch({
      type: values.wordId?'word/editSingle':'word/addMulit',
      payload:array,
      callback:(res)=>{
        form.resetFields();
        queryList();
      }
    })
  }
  const view=(record)=>{
    form.setFieldsValue(record);
    setSingleAddVisible(true);
  }
  const gotoCourse=(courseKey)=>{
    setTab("1");
    // todo search
  }

  const newColumns=columns.concat([
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      fixed:'right',
      render: (_, record) =>{
        return  (
          <>
            
            <a onClick={()=>view(record)} style={{marginRight:10}}>
              编辑</a>
            <a onClick={()=>{
              Modal.confirm({
                title: '确认删除此条目?',
                icon: <ExclamationCircleOutlined />,
                content: '一旦删除无法恢复。',
                onOk() {
                  dispatch({
                    type: 'word/deleteSingle',
                    payload:{wordId:record.wordId},
                    callback:(res)=>{
                      message.success('删除成功,刷新列表。')
                      queryList()
                    }
                  })
                },
                onCancel() {
                },
              });
            }}>
              删除</a>
          </>
        )
      },
    },
  ])

  const operations=(<div>
    <Button onClick={()=>queryList()}>手动刷新页面</Button>
    <Upload 
  action={'/api/fakeUploadUrl/'} beforeUpload={beforeOCR}
  customRequest={customRequest}
  showUploadList={false}
// onRemove={(file)=>{removeFile(file)}}
  fileList={uploadData}
  // progress={progress}
  multiple={true}
><Button style={{marginLeft:10,marginRight:10}} key="upload_excel" type="primary">导入pptx</Button></Upload>
<Button onClick={()=>setSingleAddVisible(true)}>单个添加</Button>
</div>)
  return (
    <div>
      <h3>认字的列表页</h3>
      <p>pptx上传须知：上传文件格式不是ppt。文件名字即为课程编号。例如:5.pptx</p>
      
        {/* 选项卡部分   */}

          <Tabs onChange={changeTab} activeKey={tab} type="card" tabBarExtraContent={operations}>            
            <TabPane tab="按字排序" key="1">
            <Table dataSource={wordList} columns={newColumns} />
            </TabPane>
            <TabPane tab="按课件排序" key="2">
              {console.log(courseObj,'=courseOBj')}
              <Row gutter={24}>
              {Object.keys(courseObj).map(courseKey=>
                
                <Col {...gridLayout}><Card title={`第${courseKey}课`} extra={(<a onClick={()=>gotoCourse(courseKey)}>查看</a>)}>
                {`共${courseObj[courseKey].length}字`}
                </Card></Col>
                
              )}
              </Row>
            </TabPane>
          </Tabs>

        {/* 弹窗部分   */}
        <Form
      name="add" form={form} {...layout}
      onFinish={onFinish}
      onFinishFailed={()=>setSingleAddVisible(false)}//{onFinishFailed}
    >
      <Modal title="编辑/添加单个汉字" visible={addVisible} onOk={onFinish} onCancel={()=>setSingleAddVisible(false)}
      footer={[
        <Button key="back" onClick={()=>{setSingleAddVisible(false);form.resetFields();}}>
          取消
        </Button>,
        <Form.Item style={{display:'inline-block',marginLeft:10}}><Button key="submit" type="primary" htmlType="submit" >
          提交
        </Button></Form.Item>,
      ]}
      getContainer={false}
      >
        <Form.Item
        // style={{display:none}}
        label="字编号"
        name="wordId"
        rules={[]}
      >
        <InputNumber disabled/>
      </Form.Item>

      <Form.Item
        label="课程号"
        name="courseNo"
        rules={[{ required: true, message: '必填' }]}
      >
        <InputNumber />
      </Form.Item>
      
      <Form.Item
        label="汉字"
        name="word"
        rules={[{ required: true, message: '必填' }]}
      >
        <Input onBlur={(e)=>{setPinyin(e)}}/>
      </Form.Item>

      <Form.Item
        label="拼音(自动生成)"
        name="pinyin"  
      >
        <Input disabled/> 
      </Form.Item>

      <Form.Item
        label="拼音首字母(自动生成)"
        name="fristLetter"  
      >
        <Input disabled/> 
      </Form.Item>
      <Form.Item
        label="描述(选填)"
        name="des"  
      >
        <Input/> 
      </Form.Item>
      
      </Modal>
    </Form>
    </div>
  )
};
export default connect(({ loading,word }) => ({
  listing: loading.effects['word/fetch'],
  word
}))(Pptx);

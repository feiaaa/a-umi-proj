

import React, { useState, useMemo,useEffect } from 'react';
import {Upload,Button,message,Tabs,Table,Modal,Form,Input,InputNumber,Card,Col,Row} from 'antd';
import { connect, Dispatch } from 'umi';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import styles from './style.less'
import {columns} from '@/services/yby'
import _, { upperCase, values } from 'lodash';
import pptParse from 'pptx-parser';
import pptxgen from "pptxgenjs";
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
  const [searchForm]= Form.useForm();
  const [operateForm] = Form.useForm();
  const queryList=(params)=>{
    const newParams={...{page:0,course:-1},...params};
    if(addVisible)setSingleAddVisible(false)// 关闭弹窗
    dispatch({
      type: 'word/fetch',
      payload:newParams,
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
    // 按课排序
    if(e==2){
      searchForm.resetFields();
      queryList()
    }
    setTab(e)   
  }
  const onSearch=(values)=>{
    queryList(values)    
  }
  const onDownload=(values)=>{
    console.log(values,'=valuse')
    // todo 等接口
  }
  const onFinish=(values)=>{
    dispatch({
      type: 'word/addSingle',
      payload:values,
      callback:(res)=>{
        if(res && res.code==1000){queryList()}
        else if(res && res.code<0){message.error(res.msg)}
        else{}
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
    searchForm.setFieldsValue({course:courseKey});
    onSearch({course:courseKey})
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
  ]);

  const RGBToHex=(rgba,strHexFlag=false)=>{
    let str = rgba.slice(5,rgba.length - 1),
		arry = str.split(','),
		opa = Number(arry[3].trim())*100,
		strHex = "#",
		r = Number(arry[0].trim()),
		g = Number(arry[1].trim()),
		b = Number(arry[2].trim());
	
	  strHex += ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    return {color:strHex,opacity:opa};
  }

  const downloadPPT=(courseKey,random=false)=>{
    //
    // console.log(courseKey,'=searchForm coursekey',wordList)
  
    // 生成pptx
    let pres = new pptxgen();
    const newWordList=random?_.shuffle(_.cloneDeep(wordList)):_.cloneDeep(wordList);
    newWordList.forEach(el=>{
      const slide = pres.addSlide();
      //旧版颜色处理 start
      const bgcolor=`rgba(${Math.random()*254},${Math.random()*254},${Math.random()*254},${Math.random()})`;
      const colorObj=RGBToHex(bgcolor);
      const color=colorObj.color.slice(1,7)
      //旧版颜色处理 end
      slide.addText(
          `${el.word}`,
          {
              color: '363636',
              x:1.5,y:3,
              fill: { color:'F1F1F1' },
              align: pres.AlignH.center,
              fontSize:300,
              autoFit:true,
          }
      )
      // 新版底色为浅蓝色
      slide.background={fill:'#AFEEEE'};
      
    })// foreach end
    pres.writeFile('new');
  }

  const operations=(<div className={styles.operations}>
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
<Button onClick={()=>setSingleAddVisible(true) }>单个添加</Button>
</div>)
  return (
    <div>
      <h3>认字的列表页</h3>
      <p>pptx上传须知：上传文件格式不是ppt。文件名字即为课程编号。例如:5.pptx</p>
        {/* 选项卡部分   */}
          {operations}
          <Tabs onChange={changeTab} activeKey={tab} type="card" >  
                  {/* tabBarExtraContent={operations}   */}
            <TabPane tab="按字排序" key="1">
              <Card title={'查询区域'} style={{marginBottom:16}}
            >
            <Form
                  name="search" form={searchForm} layout={document.querySelector('body').offsetWidth>=868?'inline':'horizontal'}
                  formItemLayout ={{
                  labelCol: { span: 4 },
                  wrapperCol: { span: 14 },
                }}
                  onFinish={onSearch}
                  onFinishFailed={()=>message.error('查询失败')}
                  >
                  <Form.Item
                    label="课程号"
                    name="course"
                    rules={[]}
                  >
                    <InputNumber/>
                  </Form.Item>
                  <Form.Item>
                    <Button type="primary" htmlType="submit">
                      查询
                    </Button>
                  </Form.Item>
                  <Form.Item>
                    <Button type="primary" onClick={()=>downloadPPT(searchForm.getFieldValue('course'))}>
                      下载pptx
                    </Button>
                  </Form.Item>
                  <Form.Item>
                    <Button type="primary" onClick={()=>downloadPPT(searchForm.getFieldValue('course'),true)}>
                      下载乱序过的pptx
                    </Button>
                  </Form.Item>
            </Form>
            
              </Card>
              <Card title={'操作区域'} style={{marginBottom:16}}
            >
            <Form
                  name="operate" form={operateForm} layout={document.querySelector('body').offsetWidth>=868?'inline':'horizontal'}
                  formItemLayout ={{
                  labelCol: { span: 4 },
                  wrapperCol: { span: 14 },
                }}
                  onFinish={onDownload}
                  onFinishFailed={()=>message.error('查询失败')}
                  >
                  <Form.Item
                    label="随机获取个数"
                    name="number"
                    rules={[]}
                  >
                    <InputNumber/>
                  </Form.Item>
                  <Form.Item>
                    <Button type="primary" htmlType="submit">
                      下载pptx
                    </Button>
                  </Form.Item>
            </Form>
            
              </Card>
            <Table dataSource={wordList} columns={newColumns} scroll={{y:'max-content'}}/>
            </TabPane>
            <TabPane tab="按课件排序" key="2">
              <Row gutter={24}>
              {Object.keys(courseObj).map(courseKey=>
                
                <Col {...gridLayout}><Card key={courseKey} title={`第${courseKey}课`} extra={(<a onClick={()=>gotoCourse(courseKey)}>查看</a>)}
                // actions={[<a key="option1" onClick={()=>{downloadPPT(courseKey)}}>下载顺序排列的pptx</a>,<a key="option2" onClick={()=>{downloadPPT(courseKey,true)}}>下载乱序排列的pptx</a>]}
                >
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
      onFinishFailed={()=>setSingleAddVisible(false)}
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

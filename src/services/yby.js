import request from '@/utils/request';
import { stringify } from 'qs';
// 按课获取列表
export async function queryList(params) {
  return request(`/yby/WordCourse/getWordCourse${params?`?${stringify(params)}`:''}`);
}
// 添加1个单词
export async function addSingle(params) {
  return request(`/yby/WordCourse/addWord`,{method:'POST',data: params});
}
// 添加多个单词
export async function addMulit(params) {
  return request(`/yby/WordCourse/addWords`,{method:'POST',data: params});
}
// 编辑1个单词
export async function editSingle(params) {
  return request(`/yby/WordCourse/editWord`,{method:'POST',data: params});
}
// 删除1个单词
export async function deleteSingle(params) {
  return request(`/yby/WordCourse/deleteWord?${stringify(params)}`,{method:'POST'});
}


export const columns=[{
  title: '序号',
  dataIndex: 'wordId',
  key: 'wordId',
  width:80
},
{
  title: '首字母',
  dataIndex: 'fristLetter',
  key: 'fristLetter',
},
{
  title: '字',
  dataIndex: 'word',
  key: 'word',
},
{
  title: '拼音',
  dataIndex: 'pinyin',
  key: 'pinyin',
},
{
  title: '课程号',
  dataIndex: 'courseNo',
  key: 'courseNo',
}
]
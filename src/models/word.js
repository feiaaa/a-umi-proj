import { queryList,addSingle,addMulit,editSingle,deleteSingle } from '@/services/yby';
const WordModel = {
  namespace: 'word',
  state: {
    list: [],
  },
  effects: {
    *fetch({_,payload}, { call, put }) {
      const response = yield call(queryList,payload);
      yield put({
        type: 'saveList',
        payload: {list:response.data ||[]},
      });
    },
    *addSingle({callback,payload}, { call, put }) {
      const response = yield call(addSingle,payload);
      if(callback)callback(response)
    },
    *addMulit({callback,payload}, { call, put }) {
      const response = yield call(addMulit,payload);
      if(callback)callback(response)
    },
    *editSingle({callback,payload}, { call, put }) {
      const response = yield call(editSingle,payload);
      if(callback)callback(response)
    },
    *deleteSingle({callback,payload}, { call, put }) {
      const response = yield call(deleteSingle,payload);
      if(callback)callback(response)
    },
  },
  reducers: {
    saveList(state, action) {
      return { ...state, ...action.payload};
    },
  },
};
export default WordModel;

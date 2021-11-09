import { queryTif } from '@/services/user';
const TifModel = {
  namespace: 'tif',
  state: {
    list: [],
  },
  effects: {
    
    *queryTif({callback,payload}, { call, put }) {
      const response = yield call(queryTif,payload);
      if(callback)callback(response)
    },
    
  },
  reducers: {
    
  },
};
export default TifModel;

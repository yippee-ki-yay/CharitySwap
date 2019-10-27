import { combineReducers } from 'redux';
import dao from './daoReducer';
import swapReducer from './swapReducer';
import web3Reducer from './web3Reducer';

export default combineReducers({
  dao,
  web3Reducer,
  swapReducer,
});

import { combineReducers } from "redux";
import transactionReducer from "./transaction-reducer";
import deviceReducer from "./device-reducer";
import divisionReducer from "./division-reducer";
import settingReducer from "./setting-reducer";
import subtypeReducer from "./subtype-reducer";
import systemconfigReducer from "./systemconfig-reducer";
import transactionimageReducer from "./transactionimage-reducer";
import transactionthumbnail from "./transactionthumbnail-reducer";

export default combineReducers({
  transactions: transactionReducer,
  divisions:divisionReducer,
  settings:settingReducer,
  devices:deviceReducer,
  subtypes:subtypeReducer,
  systemconfig:systemconfigReducer,
  transactionImages:transactionimageReducer,
  transactionThumbnails:transactionthumbnail
});

import { Setting } from "../../models/setting-model";

const initialState = {
    setting:Setting,
    allSettings:[]
}

const settingReducer = (state = initialState, action) => {
    return state;
}

export default settingReducer;
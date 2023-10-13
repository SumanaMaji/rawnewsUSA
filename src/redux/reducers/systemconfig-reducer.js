import { SystemConfig } from "../../models/systemconfig-model";

const initialState = {
    systemConfig:SystemConfig,
    allSystemConfigs:[]
}

const systemConfigReducer = (state = initialState, action) => {
    return state;
}

export default systemConfigReducer;
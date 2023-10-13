import { User } from "../../models/usser.model";

const initialState = {
    user:User,
    allUsers:[]
}

const userReducer = (state = initialState, action) => {
    return state;
}

export default userReducer;
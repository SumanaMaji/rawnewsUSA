import {UserActivity} from '../../models/useractivity-model';

const initialState = {
  userActivity: UserActivity,
  allUserActivity: [],
};

const userActivityReducer = (state = initialState, action) => {
  return state;
};

export default userActivityReducer;

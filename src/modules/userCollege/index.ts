export { userCollegeRoutes } from "./userCollege.route";

export  { 
  CreateUserCollegeInput,
  UpdateUserCollegeRole,
  CreateUserCollegeDatabase
} from './userCollege.schema';

export {
  createUserCollegeHandler,
  updateUserCollegeRoleHandler,
  getUserCollegeHandler,
  deleteUserCollegeHandler
} from "./userCollege.controller";

export {
  createUserCollege,
  updateUserCollegeRole,
  findUserCollegeById,
  deleteUserCollegeById,
  findUserCollegeByUserId
} from "./userCollege.service";
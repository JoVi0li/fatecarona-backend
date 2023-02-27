export { userCollegeRoutes } from "./userCollege.route";

export {
  createUserCollegeHandler,
  updateUserCollegeRoleHandler,
  getUserCollegeHandler,
  deleteUserCollegeHandler
} from "./userCollege.controller";

export {
  createUserCollege,
  updateUserCollegeRole,
  findEventsWhereIAmParticipant,
  findUserCollegeById,
  deleteUserCollegeById
} from "./userCollege.service";
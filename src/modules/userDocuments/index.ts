export { userDocumentsRoutes } from './userDocuments.route';

export {
  createUserDocumentsHandler,
  updateUserDocumentsHandler,
  getUserDocumentsHandler,
  deleteUserDocumentsHandler
} from "./userDocuments.controller";

export {
  createUserDocuments,
  updateUserDocuments,
  getUserDocumentsById,
  deleteUserDocumentsById,
  getPhotoByUserCollegeId
} from "./userDocuments.service"
export { default as collegeRoutes } from './college.route';

export { CreateCollegeInput, UpdateCollegeNameInput } from './college.schema';

export {
  createCollegeHandler,
  getCollegeHandler,
  getAllCollegesHandler,
  deleteCollegeHandler,
  updateCollegeHandler
} from './college.controller';

export {
  createCollege,
  getCollege,
  getAllColleges,
  deleteCollege,
  updateCollegeName
} from './college.service';
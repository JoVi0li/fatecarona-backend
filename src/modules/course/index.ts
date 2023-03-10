export { default as courseRoutes } from './course.route';

export { CreateCourseInput, UpdateCourseInput } from './course.schema';

export {
  createCourseHandler,
  getCourseHandler,
  getAllCoursesHandler,
  deleteCourseHandler,
  updateCourseHandler
} from './course.controller';

export {
  createCourse,
  getCourse,
  getAllCourses,
  deleteCourse,
  updateCourse
} from './course.service';
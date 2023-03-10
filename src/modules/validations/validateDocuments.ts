import { UserDocument } from "@prisma/client";
import { EventEmitter } from "events";
import { s3Service, OCRService } from "../../shared/services";
import { getCollege } from "../college/college.service";
import { findUserCollegeById } from "../userCollege";
import { validateStudentNumber } from "../userCollege/userCollege.service";
import { getUserDocumentsById, updateUserDocuments } from "../userDocuments";

const emitter = new EventEmitter();

emitter.on('validateUserPhoto', async (photo: UserDocument) => {
  const { getFile } = s3Service();

  const file = await getFile(photo.key);
  const document = await getUserDocumentsById(photo.id);


  if (!file || !document) {
    return emitter.emit("fileNotFound", document);
  }

  const userCollege = await findUserCollegeById(document.userCollegeId);

  if (!userCollege) {
    return emitter.emit("userCollegeNotFound", document.userCollegeId);
  }

  const newPhoto = document;

  newPhoto.isValid = true;

  const updatedPhoto = await updateUserDocuments(newPhoto.id, newPhoto, document);

  if (!updatedPhoto.isValid) return console.log("errorWhileUpdatePhoto");

  return emitter.emit("validPhoto", userCollege.user.email);
});

emitter.on('validateUserDocumentFront', async (document: UserDocument) => {
  const { getFileUrl } = s3Service();

  const url = await getFileUrl(document.key);

  if (!url) return console.log("fileNotFound");

  const userCollege = await findUserCollegeById(document.userCollegeId);

  if (!userCollege) return console.log("userCollegeNotFound");

  const documentUpdated = await updateUserDocuments(
    document.id,
    {
      key: document.key,
      isValid: true,
    },
    document
  );

  if (!documentUpdated.isValid) return console.log("validateUserDocumentFront");
});

emitter.on('validateUserDocumentBack', async (document: UserDocument) => {
  const { getFileUrl } = s3Service();
  const { readFile } = OCRService();

  const url = await getFileUrl(document.key);

  if (!url) return console.log("fileNotFound");

  const text = await readFile(url);

  const userCollege = await findUserCollegeById(document.userCollegeId);

  if (!userCollege) return console.log("userCollegeNotFound");

  const nameIsValid = text.includes(userCollege.user.name.toUpperCase());

  const identityDocument = text.match(`[0-9]{9}\/\[0-9]{2}`)?.toString().replace("/", "");

  const identityDocumentIsValid = identityDocument == userCollege.user.identityDocument;

  if (!nameIsValid || !identityDocumentIsValid) return console.log("invalidUserDocumentFront");

  const documentUpdated = await updateUserDocuments(document.id, { key: document.key, isValid: true }, document);

  if (!documentUpdated.isValid) return console.log("validateUserDocumentFront");
});

emitter.on('validateCollegeDocument', async (document: UserDocument) => {
  const { getFileUrl } = s3Service();
  const { readFile } = OCRService();

  const url = await getFileUrl(document.key);

  const text = await readFile(url);

  const userCollege = await findUserCollegeById(document.userCollegeId);

  if (!userCollege) return console.log("userCollegeNotFound");

  const college = await getCollege(userCollege.course.collegeId);

  if (!college) return console.log("collegeNotFound");

  const hasValidStudentNumber = text.match('[0-9]{13}')?.toString() == userCollege.studentNumber;

  const hasValidCourseName = text.includes(userCollege.course.name);

  const hasValidCollegeName = text.includes(college.name);

  if (!hasValidStudentNumber || !hasValidCourseName || !hasValidCollegeName) return console.log("invalidCollegeDocument");

  const collegeDocumentUpdated = await updateUserDocuments(document.id, { key: document.key, isValid: true }, document);

  if (!collegeDocumentUpdated.isValid) return console.log("validateCollegeDocument", document);

  const studentUpdated = await validateStudentNumber(userCollege.id);

  if (!studentUpdated.verifiedStudentNumber) return console.log("invalidVerifiedStudentNumber");
});

export default emitter;
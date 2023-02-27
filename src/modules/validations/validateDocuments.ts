import { UserDocument } from "@prisma/client";
import { EventEmitter } from "events";
import { useS3, useOCR } from "../../shared/services";
import { getCollege } from "../college/college.service";
import { findUserCollegeById } from "../userCollege";
import { getUserDocumentsById, updateUserDocuments } from "../userDocuments";

const emitter = new EventEmitter();

emitter.on('validateUserPhoto', async (photo: UserDocument) => {
  console.log("validateUserPhoto");
  const { getFile } = useS3();

  const file = await getFile(photo.key, "photos");
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

  if(!updatedPhoto.isValid) {
    return emitter.emit("errorWhileUpdatePhoto");
  }

  console.log("validateUserPhoto", "deu certo");

  return emitter.emit("validPhoto", userCollege.user.email);
});

emitter.on('validateUserDocumentFront', async (document: UserDocument) => {
  console.log("validateUserDocumentFront");

  const { getFile } = useS3();
  const { readFile } = useOCR();

  const file = await getFile(document.key, "documents");

  if (!file) {
    return emitter.emit("fileNotFound", document);
  }

  const text = await readFile(file!.toString());

  const userCollege = await findUserCollegeById(document.userCollegeId);

  if (!userCollege) {
    return emitter.emit("userCollegeNotFound", document.userCollegeId);
  }

  const isValid = text.includes(userCollege.user.name);

  if (!isValid) {
    return emitter.emit("invalidUserDocumentFront", userCollege.user.email);
  }

  const documentUpdated = await updateUserDocuments(
    document.id,
    {
      url: document.url,
      key: document.key,
      isValid: true,
    },
    document
  );

  if (!documentUpdated.isValid) {
    return emitter.emit("validateUserDocumentFront", document);
  }

  console.log("validateUserDocumentFront", "deu certo");


  return emitter.emit("validUserDocumentFront", userCollege.user.email);
});

emitter.on('validateUserDocumentBack', async (document: UserDocument) => {
  console.log("validateUserDocumentBack");

  const { getFile } = useS3();
  const { readFile } = useOCR();

  const file = await getFile(document.key, "documents");

  if (!file) {
    return emitter.emit("fileNotFound", document);
  }

  const text = await readFile(file!.toString());

  const userCollege = await findUserCollegeById(document.userCollegeId);

  if (!userCollege) {
    return emitter.emit("userCollegeNotFound", document.userCollegeId);
  }

  const nameIsValid = text.includes(userCollege.user.name);
  const identityDocumentIsValid = text.includes(userCollege.user.identityDocument);

  if (!nameIsValid || !identityDocumentIsValid) {
    return emitter.emit("invalidUserDocumentFront", userCollege.user.email);
  }

  const documentUpdated = await updateUserDocuments(
    document.id,
    {
      url: document.url,
      key: document.key,
      isValid: true,
    },
    document
  );

  if (!documentUpdated.isValid) {
    return emitter.emit("validateUserDocumentFront", document);
  }

  console.log("validateUserDocumentBack", "deu certo");


  return emitter.emit("validUserDocumentFront", userCollege.user.email);
});

emitter.on('validateCollegeDocument', async (document: UserDocument) => {
  console.log("validateCollegeDocument");

  const { getFile } = useS3();
  const { readFile } = useOCR();

  const file = await getFile(document.key, "documents");

  if (!file) {
    return emitter.emit("fileNotFound", document);
  }

  const text = await readFile(file!.toString());

  const userCollege = await findUserCollegeById(document.userCollegeId);

  if (!userCollege) {
    return emitter.emit("userCollegeNotFound", document.userCollegeId);
  }

  const college = await getCollege(userCollege.course.collegeId);

  if (!college) {
    return emitter.emit("collegeNotFound");
  }

  const hasValidStudentNumber = text.includes(userCollege.studentNumber);
  const hasValidCourseName = text.includes(userCollege.course.name);
  const hasValidCollegeName = text.includes(college.name);

  if (!hasValidStudentNumber || !hasValidCourseName || !hasValidCollegeName) {
    return emitter.emit("invalidCollegeDocument");
  }

  const collegeDocumentUpdated = await updateUserDocuments(
    document.id,
    {
      key: document.key,
      url: document.url,
      isValid: true
    },
    document
  );

  if (!collegeDocumentUpdated.isValid) {
    return emitter.emit("validateCollegeDocument", document);
  }

  console.log("validateCollegeDocument", "deu certo");

  return emitter.emit("validCollegeDocument", userCollege.user.email);
});


export default emitter;
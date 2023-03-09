export type FieldnameType = "IDENTITY_DOCUMENT_FRONT" | "IDENTITY_DOCUMENT_BACK" | "COLLEGE_DOCUMENT" | "PHOTO";

export interface FilesUploadedResult {
  key: string,
  type: FieldnameType
}
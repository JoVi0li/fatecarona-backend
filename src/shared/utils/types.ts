export type TokenStatus = "SIGNUP" | "SIGNIN" | "VERIFY_EMAIL";

export type SignUpToken = {
  userId: string;
  name: string;
  email: string;
  status: TokenStatus;
}

export type SignInToken = {
  userId: string;
  studentId: string;
  courseId: string;
  name: string;
  email: string;
  role: string;
  status: TokenStatus;
  photoUrl: string;
}
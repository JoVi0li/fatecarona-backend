import { User, UserCollege } from "@prisma/client";
import { FastifyRequest } from "fastify";
import { getPhotoByUserCollegeId } from "../../modules/userDocuments";
import { useS3 } from "../services";

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

const jwtUtil = (req: FastifyRequest,) => {

  const generateSignUpToken = (user: User) => {
    const data: SignUpToken = {
      userId: user.id,
      name: user.name,
      email: user.email,
      status: "SIGNUP"
    };

    const options = {
      expiresIn: "1h",
      aud: "Fatecarona",
    };

    const token = req.jwt.sign(data, options);

    return token;
  }

  const generateSignInToken = async (
    user: (User & {
      userCollege: UserCollege | null;
    })
  ) => {

    const { getFileUrl } = useS3();

    const document = await getPhotoByUserCollegeId(user.userCollege!.id);

    const photoUrl = await getFileUrl(document!.key);

    const data: SignInToken = {
      userId: user.id,
      studentId: user.userCollege!.id,
      courseId: user.userCollege!.courseId,
      name: user.name,
      email: user.email,
      role: user.userCollege!.role,
      status: "SIGNIN",
      photoUrl: photoUrl
    };

    const options = {
      expiresIn: 60 * 24 * 7,
      aud: "Fatecarona",

    };

    const token = req.jwt.sign(data, options);

    return token;
  }

  return { generateSignUpToken, generateSignInToken };

}

export default jwtUtil;
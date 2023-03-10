import { FastifyRequest } from "fastify";
import { getPhotoByUserCollegeId } from "../../modules/userDocuments";
import { User, UserCollege } from "@prisma/client";
import { SignUpToken, SignInToken } from "./types";
import { s3Service } from "../services";

const jwtUtil = (req: FastifyRequest) => {

  const generateSignUpToken = (user: User) => {
    const data: SignUpToken = {
      userId: user.id,
      name: user.name,
      email: user.email,
      status: "SIGNUP"
    };

    const options = {
      expiresIn: "1h",
      aud: "Fatecarona"
    };

    const token = req.jwt.sign(data, options);

    return token;
  }

  const generateSignInToken = async (
    user: (User & {
      userCollege: UserCollege | null;
    })
  ) => {
    const { getFileUrl } = s3Service();

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
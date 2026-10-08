import { compareSync, hashSync } from "bcrypt";
import { Decrypt, Encrypt } from "../../common/security/encrypt.js";
import * as dbService from "../../DB/DB.service.js";
import userModel from "../../DB/models/user.model.js";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import { providerEnum } from "../../common/enum/user.enum.js";

export const signUP = async (req, res, next) => {
  
  const { fName, lName, email, password, age, gender, phone } = req.body;
  const emailExist = await userModel.findOne({
    email: email.toLowerCase(),
  });
  if (emailExist) {
    throw new Error("Email already exist", { cause: 409 });
  }
  const paths = []
  for (const file of req.files.images) {
    paths.push(file.path)
  }
  const user = await dbService.create({
    model: userModel,
    data: {
      fName,
      lName,
      email,
      password: hashSync(password, 12),
       profileImage: req.files.images[0].path,
      coverImage: paths,

      age,
      gender,
      phone: Encrypt(phone),
    },
  });
  return res.status(201).json({ message: "Signup done", user });
};

export const signIn = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await dbService.findOne({
    model: userModel,
    filter: { email: email.toLowerCase(), provider: providerEnum.system },
  });
  if (!user) {
    throw new Error("Email is not exist", { cause: 409 });
  }
  // if (user.isConfirmed !== true) {
  // throw new Error("Email is not confirmed");
  //}
  if (!compareSync(password, user.password)) {
    throw new Error("invalid password", { cause: 409 });
  }
  const access_token = jwt.sign({ id: user._id, email: user.email }, "ahmed", {
    expiresIn: "1h",
  });
  const refresh_token = jwt.sign({ id: user._id }, "ahmed123", {
    expiresIn: "1d",
  });

  return res.status(200).json({
    message: "done",
    tokens: { access_token, refresh_token },
  });
};

export const getProfile = async (req, res, next) => {
  return res.status(200).json({
    message: "done",
    user: req.user,
  });
};
const client = new OAuth2Client();

export const signUPWithGmail = async (req, res, next) => {
  const { idToken } = req.body;

  const decoded = await client.verifyIdToken({
    idToken,
    audience:
      "244418229109-u92b2v2h80v5d9jlojum82lr3s6ipfci.apps.googleusercontent.com",
  });
  const { email, email_verified, picture, given_name, family_name } =
    decoded.getPayload();

  let user = await userModel.findOne({
    email: email.toLowerCase(),
  });
  if (!user) {
    user = await dbService.create({
      model: userModel,
      data: {
        fName: given_name,
        lName: family_name,
        email,
        profileImage: picture,
        isConfirmed: email_verified,
        provider: providerEnum.google,
      },
    });
  }
  if (user.provider == providerEnum.system) {
    throw new Error("sign in with application");
  }

  const access_token = jwt.sign({ id: user._id, email: user.email }, "ahmed", {
    expiresIn: "1h",
  });
  const refresh_token = jwt.sign({ id: user._id }, "ahmed123", {
    expiresIn: "1d",
  });

  return res.status(200).json({
    message: "done",
    tokens: { access_token, refresh_token },
  });
};

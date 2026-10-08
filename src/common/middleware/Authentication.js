import jwt from "jsonwebtoken";
import { findOne } from "../../DB/DB.service.js";
import userModel from "../../DB/models/user.model.js";

export const authentication = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    throw new Error("token is not exist", { cause: 409 });
  }
  const decoded = jwt.verify(authorization, "ahmed");
if (!decoded?.id) {
        throw new Error("invalid token", { cause: 409 });

}
  const user = await findOne({
    model: userModel,
    filter: { email: decoded.email.toLowerCase() },
  });
  if (!user) {
    throw new Error("user not exist", { cause: 409 });
  }
  req.user = user;
  next();
};

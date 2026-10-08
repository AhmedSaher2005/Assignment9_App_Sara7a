import { Router } from "express";
import * as US from "./user.services.js";
import { authentication } from "../../common/middleware/Authentication.js";
import { authorization } from "../../common/middleware/authorization.js";
import { roleEnum } from "../../common/enum/user.enum.js";
import { validation } from "../../common/middleware/validation.js";
import { signUpSchema } from "./user.validation.js";
import { multerLocal } from "../../common/middleware/multer.js";

const userRouter = Router();

userRouter.post(
  "/signUp",
  multerLocal({ customPath: "admin", customType: ["image/jpeg"] }).fields([
    { name: "image", max: 1 },
    { name: "images", max: 3 },
  ]),
  validation(signUpSchema),
  US.signUP,
);
userRouter.post("/signup/gmail", US.signUPWithGmail);

userRouter.get("/signIn", US.signIn);
userRouter.get(
  "/getProfile",
  authentication,
  authorization(Object.values(roleEnum)),
  US.getProfile,
);

export default userRouter;

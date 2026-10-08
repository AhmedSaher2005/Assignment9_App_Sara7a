import { signUpSchema } from "../../modules/users/user.validation.js";

export const validation = (Schema) => {
  return (req, res, next) => {
    const errResult = [];
    for (const key of Object.keys(Schema)) {
      const { error } = Schema[key].validate(req[key], { abortEarly: false });
      if (error) {
        error.details.forEach((err) => {
          errResult.push({
            message: err.message,
            path: err.path[0],
            key
          });
        });
      }
    }
if (errResult.length) {
           return res.status(400).json({ message: "validation err", error:errResult });

}
    next();
  };
};

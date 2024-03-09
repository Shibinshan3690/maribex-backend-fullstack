import Joi from "joi";

const JoiUserModel = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    username: Joi.string().alphanum().min(3).max(10).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
});

export default JoiUserModel;
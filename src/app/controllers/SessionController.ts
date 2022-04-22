import * as jwt from "jsonwebtoken";
import { Request, Response } from "express";
import * as Yup from "yup";

import User from "../models/User";
import { checkPassword } from "./validations/encrypt";
import auth from "../../config/auth";

export class SessionController {
  public async store(req: Request, res: Response) {
    const { email, password } = req.body;

    const schema = Yup.object().shape({
      email: Yup.string().email().required(),
      password: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res
        .status(401)
        .json({ error: "Error on login, check the fields and try again " });
    }
    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    if (!checkPassword(password, user.password)) {
      return res.status(401).json({ error: "Password does not match" });
    }

    const { _id, name, credits, movies_id } = user;

    return res.json({
      user: {
        id: _id,
        name,
        email,
        credits,
        movies_id
      },
      token: jwt.sign({ _id }, auth.secret, {
        expiresIn: auth.expiresIn,
      }),
    });
  }
}

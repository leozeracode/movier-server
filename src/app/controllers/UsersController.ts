import { Request, Response } from "express";
import * as Yup from "yup";

import User from "../models/User";
import { BuyMovie, UserModel } from "../models/interfaces/User";
import { checkPassword } from "./validations/encrypt";
import Movie from "../models/Movie";

export class UsersController {
  public async index(req: Request, res: Response) {
    const users = await User.find();
    return res.status(200).json(users);
  }

  public async show(req: Request, res: Response) {
    const userId = req.params._id;

    if (!userId) return res.status(400).json({ error: "Id must be provided." });

    const user = await User.findById({ _id: userId });

    if (!user) return res.status(400).json({ error: "User not found." });

    return res.status(200).json(user);
  }

  public async store(req: Request, res: Response) {
    const params: UserModel = req.body;

    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().email().required(),
      password: Yup.string().required().min(6),
    });

    if (!(await schema.isValid(params))) {
      return res
        .status(400)
        .json({ error: "Error saving, check the fields and try again " });
    }

    try {
      const userExists = await User.findOne({ email: params.email });

      if (userExists)
        return res.status(400).json({ error: "User already exists." });

      User.create(params)
        .then((user) => res.status(201).json(user))
        .catch((err: Error) => res.status(500).json(err));
    } catch (error) {
      res.status(500).send(error);
    }
  }
  
  public async update(req: Request, res: Response) {
    const userId = req.params._id;

    const params: UserModel = req.body;

    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      oldPassword: Yup.string().min(6),
      password: Yup.string()
        .min(6)
        .when("oldPassword", (oldPassword, field) =>
          oldPassword ? field.required() : field
        ),
      confirmPassword: Yup.string().when("password", (password, field) =>
        password ? field.required().oneOf([Yup.ref("password")]) : field
      ),
    });

    if (!(await schema.isValid(params))) {
      return res
        .status(400)
        .json({ error: "Error saving, check the fields and try again " });
    }

    if (!userId) return res.status(400).json({ error: "Id must be provided." });

    const user = await User.findById({ _id: userId });

    if (!user) return res.status(400).json({ error: "User was not found." });

    if (params.email !== user.email) {
      const userExists = await User.findOne({ email: params.email });

      if (userExists)
        return res.status(400).json({ error: "User already exists." });
    }

    if (
      params.oldPassword &&
      !checkPassword(params.oldPassword, user.password)
    ) {
      return res.status(401).json({ error: "Password does not match" });
    }

    try {
      const user = await User.findByIdAndUpdate(userId, params, {
        new: true,
      });

      return res.status(201).json(user);
    } catch (error) {
      return res.status(500).json(error);
    }
  }

  public async buyMovie(req: Request, res: Response) {
    const params: BuyMovie = req.body;

    const schema = Yup.object().shape({
      userId: Yup.string().required(),
      movieId: Yup.string().required()
    });

    if (!(await schema.isValid(params))) {
      return res
        .status(400)
        .json({ error: "Error on buying, check the fields and try again " });
    }

    const { movieId, userId } = params;

    const user = await User.findById({ _id: userId });
    const movie = await Movie.findById({ _id: movieId });


    if (!user) return res.status(400).json({ error: "User was not found." });
    if (!movie) return res.status(400).json({ error: "User was not found." });

    if (user.movies_id.find(m => m === movie._id)) return res.status(400).json({ error: "User already owns the movie." });

    if (user.credits < movie.price) return res.status(400).json({ error: "User does not have enough credits." });

    user.credits = user.credits - movie.price;
    user.movies_id.push(movieId)


    try {
      const userBuy = await User.findByIdAndUpdate(userId, user, {
        new: true,
      });
      const {  credits, movies_id } = userBuy;

      return res.status(201).json({user:{
        credits,
        movies_id
      }});
    } catch (error) {
      return res.status(500).json(error);
    }

  }

  public async destroy(req: Request, res: Response) {
    const userId = req.params._id;
    if (!userId) return res.status(400).json({ error: "Id must be provided." });

    const user = await User.findById({ _id: userId });

    if (!user) return res.status(400).json({ error: "user was not found." });

    try {
      await User.remove(user);
      return res.status(200).json({ message: "user  removed successfully." });
    } catch (error) {
      return res.status(500).json(error);
    }
  }

  public async updatePassword(req: Request, res: Response) {
    const params: UserModel = req.body;

    const schema = Yup.object().shape({
      email: Yup.string().email().required(),
      document: Yup.string().required(),
      phone: Yup.string().required(),
      password: Yup.string().min(6),
      confirmPassword: Yup.string()
        .min(6)
        .when("password", (password, field) =>
          password ? field.required() : field
        ),
    });

    if (!(await schema.isValid(params))) {
      return res
        .status(400)
        .json({ error: "Error saving, check the fields and try again " });
    }

    const user = await User.findOne({
      email: params.email,
      document: params.document,
      phone: params.phone,
    });

    const userId = user._id;

    if (!user) return res.status(400).json({ error: "User was not found." });

    try {
      const user = await User.findByIdAndUpdate(userId, params, {
        new: true,
      });

      return res.status(201).json(user);
    } catch (error) {
      return res.status(500).json(error);
    }
  }
}

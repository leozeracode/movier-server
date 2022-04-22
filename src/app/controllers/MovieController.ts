
import { Request, Response } from "express";
import Movie from "../models/Movie";
import { MovieModel } from "../models/interfaces/Movie";


export class MovieController{
  public async index(req: Request, res: Response) {
    const movies = await Movie.find();
    return res.status(200).json(movies);
  }

  public async show(req: Request, res: Response) {
    const movieId = req.params._id;

    if (!movieId) return res.status(400).json({ error: "Id must be provided." });

    const movie = await Movie.findById({ _id: movieId });

    if (!movie) return res.status(400).json({ error: "Movie not found." });

    return res.status(200).json(movie);
  }

  public async store(req: Request, res: Response) {
    const params: MovieModel = req.body;

    Movie.create(params)
      .then((Movie) => res.status(201).json(Movie))
      .catch((err: Error) => res.status(500).json(err));
  } 
  
  public async update(req: Request, res: Response) {
    const movieId = req.params._id;
    const params: MovieModel = req.body;

    if (!movieId) return res.status(400).json({ error: "Id must be provided." });

    const movie = await Movie.findById({ _id: movieId });

    if (!movie) return res.status(400).json({ error: "Movie was not found." });

    try {
      const movie = await Movie.findByIdAndUpdate(movieId, params, {
        new: true,
      });

      return res.status(201).json(movie);
    } catch (error) {
      return res.status(500).json(error);
    }
  }
  
  public async destroy(req: Request, res: Response) {
    const movieId = req.params._id;
    if (!movieId)
      return res.status(400).json({ error: "Id must be provided." });

      const movie = await Movie.findById({ _id: movieId });

      if (!movie)
        return res.status(400).json({ error: "Movie was not found." });
    
    try {
      await Movie.remove(movie);
      return res.status(200).json({ message: "Movie  removed successfully." });
    } catch (error) {
      return res.status(500).json(error);
    }
  }
  
}



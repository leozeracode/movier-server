import * as mongoose from "mongoose";
import { MovieInterface } from "./interfaces/Movie";

const MovieSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    image_url: {
      type: String,
      required: true,
    },
    movie_url: {
      type: String,
      required: true,
    },
    release_date: {
      type: Date,
      required: true,
    },
    classification: {
      type: String,
      required: true,
    },
    gender:{
      type: String,
      required: true
    },    
    author:{
      type: String,
      required: true
    },    
    price: {
      type: Number,
      required: true
    },
    category:{
      type: Number,
      required: true
    },
    due: {
      type: Date,
      required: true
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<MovieInterface>("Movie", MovieSchema);

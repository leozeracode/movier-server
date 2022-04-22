import { Category } from "../../enums";
import { Document } from 'mongoose';

export interface MovieModel{
  _id: string,
  movie_url: string,
  image_url: string,
  name: string,
  release_date:string,
  classification: string,
  gender: string,
  author: string,
  category: Category,
  price: number,
  due: Date
}
export interface MovieInterface extends Document{
  _id: string,
  movie_url: string,
  image_url: string,
  name: string,
  release_date:string,
  classification: string,
  gender: string,
  author: string,
  category: Category,
  price: number,
  due: Date
}


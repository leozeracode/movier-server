import { Document } from 'mongoose';
import { MovieModel } from './Movie';

export interface UserModel{
  _id: string,
  name: string,
  email:string,
  password: string,
  confirmPassword: string,
  oldPassword: string,
  document: string,
  phone: string,
  credits: number,
  movies_id: string[]
}
export interface BuyMovie{
  userId: string, 
  movieId: string
}

export interface UserInterface extends Document{
  _id: string,
  name: string,
  email:string,
  password: string,
  document: string,
  phone: string,
  credits: number,
  movies_id: string[]
}

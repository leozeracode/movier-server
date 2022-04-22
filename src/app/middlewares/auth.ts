import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";

import auth from '../../config/auth';
import { Auth } from "./interfaces/Auth";

export default async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "Token not provided" });
  }

  const [, token] = authHeader.split(' ');

  try {

    jwt.verify(token, auth.secret, (err, decoded: Auth) =>{
      req.params._id = decoded._id;        
    });    
    
    return next();
  } catch (error) {
    return res.status(401).json({ error: "Token invalid" });    
  }
};

import mongoose from "mongoose";

import mongoconnect from '../config/config';

const DB_URI = mongoconnect.mongoconnect;  

export function connect() {
  mongoose
        .connect(DB_URI, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        })
        .then((res) => {
          console.log('Db connected!');
        })
        .catch((err: Error) => {
          return err;
        });
}

export function close() {
  return mongoose.disconnect();
}

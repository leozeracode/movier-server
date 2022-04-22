import express, { Application, json, urlencoded } from 'express';
import cors from 'cors';
import {Routes} from './routes';


class App{
  public app: Application;
  public routePrv: Routes = new Routes();


  constructor(){
    this.app = express();
    this.config();
    this.routePrv.routes(this.app);
  }

  private config(): void{
    this.app.use(cors());
    this.app.use(json());
    this.app.use(urlencoded({extended: true}));
  }
}

export default new App().app;
import { Sequelize } from "sequelize";
import BookModel from "./book.model.js";
import User from "./user.model.js";


import sequelizeConfig from "../config/database.js"; 



const Book = BookModel(sequelizeConfig);



const db = {
  sequelize: sequelizeConfig,
  Book,
  User,
  
};

export default db;

import BookModel from "./book.model.js";
import User from "./user.model.js";
import  Transaction from "./transaction.model.js";
import Fine from "./fine.model.js";
import sequelizeConfig from "../config/database.js"; 



const Book = BookModel(sequelizeConfig);


Transaction.belongsTo(User, { foreignKey: "userId" });
Transaction.belongsTo(Book, { foreignKey: "bookId" });

Fine.belongsTo(User, { foreignKey: "userId", as: "user" });



const db = {
  sequelize: sequelizeConfig,
  Book,
  User,
  Transaction,
  Fine,
  
};

export default db;

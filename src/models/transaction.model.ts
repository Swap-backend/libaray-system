import { DataTypes, Model, type Optional } from "sequelize";
import sequelize from "../config/database.js";
import User from "./user.model.js";
import Book from "./book.model.js";

interface TransactionAttributes {
  id: number;
  userId: number;
  bookId: number;
  borrowDate: Date;
  returnDate?: Date | null;
  status: "borrowed" | "returned";
  createdAt?: Date;
  updatedAt?: Date;
}

interface TransactionCreationAttributes
  extends Optional<TransactionAttributes, "id" | "returnDate" | "createdAt" | "updatedAt"> {}

class Transaction extends Model<TransactionAttributes, TransactionCreationAttributes>
  implements TransactionAttributes {
  declare id: number;
  declare userId: number;
  declare bookId: number;
  declare borrowDate: Date;
  declare returnDate: Date | null;
  declare status: "borrowed" | "returned";
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Transaction.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    bookId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    borrowDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    returnDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("borrowed", "returned"),
      allowNull: false,
      defaultValue: "borrowed",
    },
  },
  {
    sequelize,
    modelName: "Transaction",
    tableName: "Transactions",
    timestamps: true,
  }
);



export default Transaction;

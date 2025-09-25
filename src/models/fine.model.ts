import { DataTypes, Model, type Optional } from "sequelize";
import sequelize from "../config/database.js";
import User from "./user.model.js";

interface FineAttributes {
  id: number;
  userId: number;
  amount: number;
  reason: string;
  isPaid: boolean;
  issuedAt?: Date;
  paidAt?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}

interface FineCreationAttributes extends Optional<FineAttributes, "id" | "isPaid" | "issuedAt" | "paidAt" | "createdAt" | "updatedAt"> {}

export class Fine extends Model<FineAttributes, FineCreationAttributes> implements FineAttributes {
  declare id: number;
  declare userId: number;
  declare amount: number;
  declare reason: string;
  declare isPaid: boolean;
  declare issuedAt: Date;
  declare paidAt: Date | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Fine.init(
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
    amount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    reason: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isPaid: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    issuedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    paidAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "Fine",
    tableName: "Fines",
    timestamps: true,
  }
);


export default Fine;

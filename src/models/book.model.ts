import { Sequelize, DataTypes, Model, type ModelStatic } from "sequelize";

const BookModel = (sequelize: Sequelize): ModelStatic<Model> => {
  const Books = sequelize.define<Model>(
    "Books",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        field: "id",
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: "name",
      },
      author_name: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: "author_name",
      },
      edition: {
        type: DataTypes.STRING(50),
        allowNull: false,
        field: "edition",
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: "description",
      },
      page_count: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "page_count",
      },
      publish_date: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "publish_date",
      },
      createdAt: {
        field: "created_at",
        type: DataTypes.DATE,
        defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        field: "updated_at",
        type: DataTypes.DATE,
        defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
      },
    },
    {
      tableName: "books",
      timestamps: true,
      underscored: true,
    }
  );

  return Books;
};

export default BookModel;

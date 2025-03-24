const { DataTypes } = require("sequelize");
const sequelize = require("../config/dbConnect");
const Roles = require("./role");

const Users = sequelize.define(
  "Users",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    last_name: {
      type: DataTypes.STRING
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate:{
        isEmail: true
      }
    },
    verify_account_token: {
      type: DataTypes.STRING,
    },
    verify_account_expires: {
      type: DataTypes.DATE,
    },
    // reset_password_token: {
    //   type: DataTypes.STRING,
    // },
    role_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 3,
      references:{
        model: Roles,
        key: 'id'
      }
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    dob: {
      type: DataTypes.DATE
    },
    created_by: {
      type: DataTypes.INTEGER
    },
    updated_by: {
      type: DataTypes.INTEGER
    },
    deleted_by: {
      type: DataTypes.INTEGER
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true,   // Allow updated_at to be null
      defaultValue: null, // Set default to null
    }
  },
  {
    tableName: 'user',
    paranoid: true, // soft delete 
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    deletedAt: 'deleted_at',
    hooks: {
      beforeCreate:(user)=>{
        user.updated_at = null // explicity set updated_at to null
      }
    }
  }
);

module.exports = Users;
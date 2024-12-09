'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class municipalite extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  municipalite.init({
    code_municipalite: DataTypes.STRING,
    nom: DataTypes.STRING,
    created_at: {
      type: DataTypes.DATE
    },
    updated_at: {
      type: DataTypes.DATE
    }
  }, {
    sequelize,
    timestamps: false,
    modelName: 'municipalite',
    tableName:'municipalite'
  });
  return municipalite;
};
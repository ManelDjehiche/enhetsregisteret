'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class organisation_etablissement_forme extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  organisation_etablissement_forme.init({
    code_forme: DataTypes.STRING,
    description: DataTypes.STRING,
    lien: DataTypes.TEXT,
    created_at: {
      type: DataTypes.DATE
    },
    updated_at: {
      type: DataTypes.DATE,
    }
  }, {
    sequelize,
    timestamps: false,
    modelName: 'organisation_etablissement_forme',
    tableName:'organisation_etablissement_forme'
  });
  return organisation_etablissement_forme;
};
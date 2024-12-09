'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class forme_juridique extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  forme_juridique.init({
    code_forme_juridique: DataTypes.STRING,
    description: DataTypes.STRING,
    lien: DataTypes.TEXT,
    created_at: {
      type: DataTypes.DATE
    },
    updated_at: {
      type: DataTypes.DATE
    }
  }, {
    sequelize,
    timestamps: false,
    modelName: 'forme_juridique',
    tableName:'forme_juridique'
  });
  return forme_juridique;
};
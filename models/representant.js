'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Representant extends Model {
    static associate(models) {
      // Define associations here if needed
    }
  }
  Representant.init({
    code_type: DataTypes.STRING,
    description_type: DataTypes.STRING,
    lien_type: DataTypes.TEXT,
    numero_organisation: DataTypes.STRING,
    date_derniere_modification: DataTypes.DATE,
    // New French-named attributes
    personne_est_decede: DataTypes.BOOLEAN, // Indicates whether the person is deceased
    a_pris_sa_retraite: DataTypes.BOOLEAN, // Indicates whether the person has retired
    ordre_d_apparition: DataTypes.INTEGER, // Represents the order of appearance
    created_at: {
      type: DataTypes.TIMESTAMP,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.TIMESTAMP,
      defaultValue: DataTypes.NOW,
      onUpdate: DataTypes.NOW,
    }
  }, {
    sequelize,
    modelName: 'Representant',
  });
  return Representant;
};

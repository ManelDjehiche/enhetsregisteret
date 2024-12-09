'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Representant extends Model {
    static associate(models) {
      // Define associations here if needed
    }
  }

  Representant.init(
    {
      code_type: DataTypes.STRING,
      description_type: DataTypes.STRING,
      lien_type: DataTypes.TEXT,
      numero_organisation: DataTypes.STRING,
      date_derniere_modification: DataTypes.DATE,
      date_naissance: DataTypes.DATE, // Added: Birth date of the representative
      prenom: DataTypes.STRING, // Added: First name
      deuxieme_prenom: DataTypes.STRING, // Added: Middle name
      nom: DataTypes.STRING, // Added: Last name
      est_decede: DataTypes.BOOLEAN, // Updated: Indicates whether the person is deceased
      a_quitte: DataTypes.BOOLEAN, // Updated: Indicates whether the person has left
      ordre_apparition: DataTypes.INTEGER, // Updated: Represents the order of appearance
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        onUpdate: DataTypes.NOW,
      },
    },
    {
      sequelize,
      timestamps: false,
      modelName: 'Representant',
      tableName: 'representant',
    }
  );

  return Representant;
};

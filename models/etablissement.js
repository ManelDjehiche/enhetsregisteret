'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Etablissement extends Model {
    static associate(models) {
      // define association here
    }
  }

  Etablissement.init({
    numero_organisation: DataTypes.STRING,
    nom: DataTypes.STRING,
    code_forme_juridique: DataTypes.STRING,
    description_forme_juridique: DataTypes.STRING,
    lien_forme_juridique: DataTypes.TEXT,
    date_inscription: DataTypes.DATE,
    secteur_activite_code: DataTypes.STRING,
    secteur_activite_description: DataTypes.STRING,
    email: DataTypes.STRING,
    telephone_mobile: DataTypes.STRING,
    date_creation: DataTypes.DATE,
    adresse_commune: DataTypes.TEXT,
    code_pays: DataTypes.STRING,
    code_postal: DataTypes.STRING,
    ville: DataTypes.STRING,
    commune: DataTypes.STRING,
    numero_commune: DataTypes.STRING,
    lien_etablissement: DataTypes.TEXT,
    lien_organisation_parente: DataTypes.TEXT,
    parent_organisation: DataTypes.STRING,
    created_at: {
      type: DataTypes.DATE
    },
    updated_at: {
      type: DataTypes.DATE
    }
  }, {
    sequelize,
    timestamps: false,
    modelName: 'Etablissement',
    tableName: 'etablissement'
  });

  return Etablissement;
};

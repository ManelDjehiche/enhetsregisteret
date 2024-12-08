'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class etablissement extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  etablissement.init({
    numero_etablissement: DataTypes.STRING,
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
    date_debut: DataTypes.DATE,
    adresse_physique: DataTypes.TEXT,
    pays_physique: DataTypes.STRING,
    code_pays_physique: DataTypes.STRING,
    code_postal_physique: DataTypes.STRING,
    ville_physique: DataTypes.STRING,
    commune_physique: DataTypes.STRING,
    numero_commune_physique: DataTypes.STRING,
    lien_etablissement: DataTypes.TEXT,
    lien_organisation_parente: DataTypes.TEXT,
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
    modelName: 'etablissement',
  });
  return etablissement;
};
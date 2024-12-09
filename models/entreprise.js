'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Entreprise extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Entreprise.init({
    numero_organisation: DataTypes.STRING,
    nom: DataTypes.STRING,
    code_forme_juridique: DataTypes.STRING,
    description_forme_juridique: DataTypes.STRING,
    lien_forme_juridique: DataTypes.TEXT,
    site_web: DataTypes.STRING,

    // Simplified address fields
    adresse_commune: DataTypes.TEXT,
    code_pays: DataTypes.STRING,
    code_postal: DataTypes.STRING,
    ville: DataTypes.STRING,
    commune: DataTypes.STRING,
    numero_commune: DataTypes.STRING,

    // Removed redundant fields for postal and physical addresses
    date_inscription: DataTypes.DATE,
    enregistre_au_registre_commercial: DataTypes.BOOLEAN,
    secteur_activite_code: DataTypes.STRING,
    secteur_activite_description: DataTypes.STRING,
    email: DataTypes.STRING,
    telephone_mobile: DataTypes.STRING,
    date_creation: DataTypes.DATE,
    code_secteur_institutionnel: DataTypes.STRING,
    description_secteur_institutionnel: DataTypes.STRING,
    enregistre_dans_le_registre_volontaire: DataTypes.BOOLEAN,
    enregistre_dans_le_registre_stiftelsen: DataTypes.BOOLEAN,
    enregistre_dans_le_registre_partis: DataTypes.BOOLEAN,
    en_cours_de_liquidation: DataTypes.BOOLEAN,
    en_cours_de_dissolution: DataTypes.BOOLEAN,
    type_langue: DataTypes.STRING,
    activite: DataTypes.TEXT,
    date_inscription_registre_volontaire: DataTypes.DATE,
    lien_entreprise: DataTypes.TEXT,
    created_at: {
      type: DataTypes.DATE
    },
    updated_at: {
      type: DataTypes.DATE
    },
  }, {
    sequelize,
    timestamps: false,
    modelName: 'entreprise',
    tableName: 'entreprise'
  });
  return Entreprise;
};

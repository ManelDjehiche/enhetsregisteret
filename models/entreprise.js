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
    adresse_postale: DataTypes.TEXT,
    pays_postal: DataTypes.STRING,
    code_pays_postal: DataTypes.STRING,
    code_postal_postal: DataTypes.STRING,
    ville_postale: DataTypes.STRING,
    commune_postale: DataTypes.STRING,
    numero_commune_postale: DataTypes.STRING,
    adresse_physique: DataTypes.TEXT,
    pays_physique: DataTypes.STRING,
    code_pays_physique: DataTypes.STRING,
    code_postal_physique: DataTypes.STRING,
    ville_physique: DataTypes.STRING,
    commune_physique: DataTypes.STRING,
    numero_commune_physique: DataTypes.STRING,
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
      type: DataTypes.TIMESTAMP,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.TIMESTAMP,
      defaultValue: DataTypes.NOW,
      onUpdate: DataTypes.NOW,
    },
  }, {
    sequelize,
    modelName: 'entreprise',
  });
  return Entreprise;
};
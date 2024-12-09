-- Disable foreign key checks to avoid constraint issues
-- Drop existing tables if they exist
DROP TABLE IF EXISTS entreprise;

-- Table entreprise
CREATE TABLE entreprise (
    id INT AUTO_INCREMENT PRIMARY KEY,
    numero_organisation VARCHAR(20) NOT NULL UNIQUE,
    nom VARCHAR(255) NOT NULL,
    code_forme_juridique VARCHAR(10),
    description_forme_juridique VARCHAR(255),
    lien_forme_juridique TEXT,
    site_web VARCHAR(255),
    
    -- Simplified address fields
    adresse_commune TEXT,
    code_pays VARCHAR(5),
    code_postal VARCHAR(10),
    ville VARCHAR(255),
    commune VARCHAR(255),
    numero_commune VARCHAR(10),
    
    date_inscription DATE,
    enregistre_au_registre_commercial BOOLEAN,
    secteur_activite_code VARCHAR(10),
    secteur_activite_description VARCHAR(255),
    email VARCHAR(255),
    telephone_mobile VARCHAR(20),
    date_creation DATE,
    code_secteur_institutionnel VARCHAR(10),
    description_secteur_institutionnel VARCHAR(255),
    enregistre_dans_le_registre_volontaire BOOLEAN,
    enregistre_dans_le_registre_stiftelsen BOOLEAN,
    enregistre_dans_le_registre_partis BOOLEAN,
    en_cours_de_liquidation BOOLEAN,
    en_cours_de_dissolution BOOLEAN,
    type_langue VARCHAR(50),
    activite TEXT,
    date_inscription_registre_volontaire DATE,
    lien_entreprise TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
);

-- Table etablissement
DROP TABLE IF EXISTS etablissement;
CREATE TABLE etablissement (
    id INT AUTO_INCREMENT PRIMARY KEY,
    numero_organisation VARCHAR(20) NOT NULL UNIQUE,
    nom VARCHAR(255),
    code_forme_juridique VARCHAR(10),
    description_forme_juridique VARCHAR(255),
    lien_forme_juridique TEXT,
    date_inscription DATE,
    secteur_activite_code VARCHAR(10),
    secteur_activite_description VARCHAR(255),
    email VARCHAR(255),
    telephone_mobile VARCHAR(20),
    date_creation DATE,
    adresse_commune TEXT,
    code_pays VARCHAR(5),
    code_postal VARCHAR(10),
    ville VARCHAR(255),
    commune VARCHAR(255),
    numero_commune VARCHAR(10),
    lien_etablissement TEXT,
    lien_organisation_parente TEXT,
    parent_organisation VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
);

-- Table forme_juridique
DROP TABLE IF EXISTS forme_juridique;
CREATE TABLE forme_juridique (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code_forme_juridique VARCHAR(10) NOT NULL UNIQUE,
    description VARCHAR(255),
    lien TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
);

-- Table municipalite
DROP TABLE IF EXISTS municipalite;
CREATE TABLE municipalite (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code_municipalite VARCHAR(10) NOT NULL UNIQUE,
    nom VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
);

-- Table representant
DROP TABLE IF EXISTS representant;
CREATE TABLE representant (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code_type VARCHAR(10), -- Code du type de rôle (ex. STYR, LEDE)
    description_type VARCHAR(255), -- Description du type de rôle (ex. Styrets leder)
    lien_type TEXT, -- Lien associé au type de rôle
    numero_organisation VARCHAR(20), -- Numéro d'organisation de l'entreprise
    date_derniere_modification DATE, -- Dernière modification du rôle
    date_naissance DATE, -- Date de naissance de la personne
    prenom VARCHAR(255), -- Prénom de la personne
    deuxieme_prenom VARCHAR(255), -- Deuxième prénom (peut être NULL)
    nom VARCHAR(255), -- Nom de famille de la personne
    est_decede BOOLEAN, -- Indique si la personne est décédée
    a_quitte BOOLEAN, -- Indique si la personne a quitté son rôle
    ordre_apparition INT, -- Ordre d'apparition du représentant
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Date de création
    updated_at TIMESTAMP DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP, -- Dernière mise à jour
    UNIQUE (nom, prenom, code_type, numero_organisation) -- Contrainte unique
    
);


-- Table organisation_forme
DROP TABLE IF EXISTS organisation_forme;
CREATE TABLE organisation_forme (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code_forme VARCHAR(10) NOT NULL UNIQUE,
    description VARCHAR(255),
    lien TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
);

-- Table organisation_etablissement_forme
DROP TABLE IF EXISTS organisation_etablissement_forme;
CREATE TABLE organisation_etablissement_forme (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code_forme VARCHAR(10) NOT NULL UNIQUE,
    description VARCHAR(255),
    lien TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
);

-- Table history_cron_jobs
DROP TABLE IF EXISTS history_cron_jobs;
CREATE TABLE history_cron_jobs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    job_name VARCHAR(255) NOT NULL,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP DEFAULT NULL,
    status VARCHAR(50) NOT NULL,
    error_message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
);

-- Table history_tables
DROP TABLE IF EXISTS history_tables;
CREATE TABLE history_tables (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cron_job_id INT NOT NULL,
    table_name VARCHAR(255) NOT NULL,
    new_rows INT DEFAULT 0,
    updated_rows INT DEFAULT 0,
    status VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    error_occurred BOOLEAN DEFAULT FALSE,
    error_message TEXT,
    UNIQUE(table_name, cron_job_id)
);

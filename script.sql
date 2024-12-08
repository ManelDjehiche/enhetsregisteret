-- Disable foreign key checks to avoid constraint issue
-- Drop existing tables if they exist
DROP TABLE IF EXISTS entreprise;

-- Table entreprise
CREATE TABLE entreprise (
    id INT AUTO_INCREMENT PRIMARY KEY,
    numero_organisation VARCHAR(20) NOT NULL,
    nom VARCHAR(255) NOT NULL,
    code_forme_juridique VARCHAR(10),
    description_forme_juridique VARCHAR(255),
    lien_forme_juridique TEXT,
    site_web VARCHAR(255),
    adresse_postale TEXT,
    pays_postal VARCHAR(50),
    code_pays_postal VARCHAR(5),
    code_postal_postal VARCHAR(10),
    ville_postale VARCHAR(255),
    commune_postale VARCHAR(255),
    numero_commune_postale VARCHAR(10),
    adresse_physique TEXT,
    pays_physique VARCHAR(50),
    code_pays_physique VARCHAR(5),
    code_postal_physique VARCHAR(10),
    ville_physique VARCHAR(255),
    commune_physique VARCHAR(255),
    numero_commune_physique VARCHAR(10),
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
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table etablissement
DROP TABLE IF EXISTS etablissement;
CREATE TABLE etablissement (
    id INT AUTO_INCREMENT PRIMARY KEY,
    numero_etablissement VARCHAR(20) NOT NULL,
    numero_organisation VARCHAR(20),
    nom VARCHAR(255),
    code_forme_juridique VARCHAR(10),
    description_forme_juridique VARCHAR(255),
    lien_forme_juridique TEXT,
    date_inscription DATE,
    secteur_activite_code VARCHAR(10),
    secteur_activite_description VARCHAR(255),
    email VARCHAR(255),
    telephone_mobile VARCHAR(20),
    date_debut DATE,
    adresse_physique TEXT,
    pays_physique VARCHAR(50),
    code_pays_physique VARCHAR(5),
    code_postal_physique VARCHAR(10),
    ville_physique VARCHAR(255),
    commune_physique VARCHAR(255),
    numero_commune_physique VARCHAR(10),
    lien_etablissement TEXT,
    lien_organisation_parente TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table forme_juridique
DROP TABLE IF EXISTS forme_juridique;
CREATE TABLE forme_juridique (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code_forme_juridique VARCHAR(10) NOT NULL,
    description VARCHAR(255),
    lien TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table municipalite
DROP TABLE IF EXISTS municipalite;
CREATE TABLE municipalite (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code_municipalite VARCHAR(10) NOT NULL,
    nom VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table representant
DROP TABLE IF EXISTS representant;
CREATE TABLE representant (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code_type VARCHAR(10),
    description_type VARCHAR(255),
    lien_type TEXT,
    numero_organisation VARCHAR(20),
    date_derniere_modification DATE,
    personne_est_decede BOOLEAN,
    a_pris_sa_retraite BOOLEAN,
    ordre_d_apparition INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table organisation_forme
DROP TABLE IF EXISTS organisation_forme;
CREATE TABLE organisation_forme (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code_forme VARCHAR(10) NOT NULL,
    description VARCHAR(255),
    lien TEXT
);

-- Table organisation_etablissement_forme
DROP TABLE IF EXISTS organisation_etablissement_forme;
CREATE TABLE organisation_etablissement_forme (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code_forme VARCHAR(10) NOT NULL,
    description VARCHAR(255),
    lien TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table history_cron_jobs
DROP TABLE IF EXISTS history_cron_jobs;
CREATE TABLE history_cron_jobs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    job_name VARCHAR(255) NOT NULL,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    status VARCHAR(50) NOT NULL,
    error_message TEXT,
    updated_table_names TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table history_tables
DROP TABLE IF EXISTS history_tables;
CREATE TABLE history_tables (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cron_job_id INT NOT NULL,
    table_name VARCHAR(255) NOT NULL,
    new_rows INT DEFAULT 0,
    updated_rows INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    error_occurred BOOLEAN DEFAULT FALSE,
    error_message TEXT
);

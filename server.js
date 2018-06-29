const mysql = require("mysql");
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "jeco",
  port: 8889
});
const connectionTwo = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "jeco_eleves",
  port: 8889
});
connection.connect();

connection.query(
  `SELECT Titre,Presentation,IdSalle,IdCadre, Texte,saisie,HeureDebut, IdType, HeureFin, Valide, TrancheHoraire,Video 
  FROM manif`,
  (error, results, fields) => {
    results.map(manif => {
      const conference = {
        title: manif.Titre,
        HallId: manif.IdSalle,
        dateStart: manif.HeureDebut,
        dateEnd: manif.HeureFin,
        description: manif.Presentation,
        active: manif.Valide,
        off: 0
      };
      if (manif.IdCadre === 5) {
        conference.off = 1;
      }

      if (manif.IdType === 1) {
        conference.type = "Conférence";
      } else if (manif.IdType === 3) {
        conference.type = "Table ronde";
      } else if (manif.IdType === 4) {
        conference.type = "Exposition";
      } else if (manif.IdType === 5) {
        conference.type = "Atelier";
      } else if (manif.IdType === 6) {
        conference.type = "Documentaire";
      } else if (manif.IdType === 7) {
        conference.type = "Conférence-débat";
      } else if (manif.IdType === 8) {
        conference.type = "Témoignages";
      }

      const query = connectionTwo.query(
        `INSERT INTO conferences SET ?`,
        conference,
        (error, results, fields) => {
          if (error) throw error;
          // Neat!
        }
      );
    });
  }
);

// Halls
connection.query(
  `SELECT Nom, Adresse, Ville, Capacite, AdressePhoto, Metro
  FROM salle`,
  (error, results, fields) => {
    results.map(salle => {
      const hall = {
        name: salle.Nom,
        street: salle.Adresse,
        street: salle.Ville
      };

      const query = connectionTwo.query(
        `INSERT INTO halls SET ?`,
        hall,
        (error, results, fields) => {
          if (error) throw error;
          // Neat!
          console.log(`Done ${results}`);
        }
      );
    });
  }
);

connection.end();

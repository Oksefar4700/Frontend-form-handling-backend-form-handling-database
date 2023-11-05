//Vi henter de nødvendige moduler.
const express = require('express'); 
const bodyParser = require('body-parser'); 
const path = require('path'); 
const sqlite3 = require('sqlite3').verbose(); // Hent SQLite til at arbejde med en database.

// Nu laver vi vores server ved hjælp af Express
const app = express();

// Her fortæller vi serveren, at den skal bruge Body-parser til at forstå data fra brugerne
app.use(bodyParser.urlencoded({ extended: false }));

// Denne linje fortæller serveren at den skal levere filerne i 'public'-mappen direkte til browseren, uden at ændre dem. Bruges til at tilgå HTML, CSS, og JavaScript filer.


//Serveren skal levere filerne i public mappen direkte til browseren. Dette bruges til f.eks. at tilgå javascript-filer.
// dvs. at alle kan se og bruge filerne i mappen.
app.use(express.static('public'));

// Vi fortæller serven hvad den skal gøre, når nogen går ind på hjememsiden(localhost:3000)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html')); // Send dem vores hjemmeside-fil.
});


// Vi fortæller serveren, hvor vores database er, og den sørger for at forbinde til den.
let db = new sqlite3.Database('./Database.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        console.error(err.message); // Hvis den ikke kan forbinde, sig det til os.
        throw err; // Og stop med at sætte serveren op, fordi noget gik galt.
    }
    console.log('Connected to the SQLite database.'); // Hvis det lykkes sende dette til consolen.
});


// Vi definerer en POST rute for at modtage den data vi modtager fra formularen og derefter indsætte det i databasen.
app.post('/submit-data', (req, res) => {
    const username = req.body.username; // Vi gemmer det brugernavn, som nogen skriver ind.
    console.log(username);  // Vi viser brugernavnet i vores servers console.

    // Så prøver vi at gemme brugernavnet i vores database:
    db.run('INSERT INTO users(username) VALUES (?)', [username], (err) => {
        if (err) {
            console.error(err.message); // Hvis det ikke virker, siger vi, at der er en fejl.
            res.status(500).send("An error occurred while saving the data"); // Og fortæller brugeren, at det ikke virkede.
        } else {
            console.log('Data saved to SQLite database.'); // Hvis det virker, siger vi det.
            res.send("Data received and saved"); // Og vi fortæller også brugeren, at det virkede.
        }
    });
});


app.get('/users', (req, res) =>{
    db.all('SELECT * FROM users', [], (err, rows) => {
        if(err) {
            res.status(500).send("An error occurred");
        } else {
            res.json(rows);
        }
    });
});

// Til sidst fortæller vi serveren, hvilken port den skal lytte på for at se, om der kommer besøg:
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`); //Vi siger her at serverne er startet og klar.
});

const express = require('express');
const sqlite3 = require('sqlite3')
const app = express();

const db = new sqlite3.Database('./Database/Car.sqlite');

app.use(express.json());

db.run(`CREATE TABLE IF NOT EXISTS cars (
    id INTEGER PRIMARY KEY,
    make TEXT,
    model TEXT,
    year INTEGER,
    price INTEGER 
)`);

app.get('/cars', (req, res) => {
    db.all('SELECT * FROM cars', (err, rows) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(rows);
        }
    });
});

app.get('/cars/:id', (req,res) => {
    db.get('SELECT * FROM cars WHERE id = ?', req.params.id, (err, row) => {
        if (err) {
            res.status(500).send(err);
        } else {
            if (!row) {
                res.status(404).send('Car not found');
            } else {
                res.json(row);
            }
        }
    });
});

app.post('/cars', (req, res) => {
    const car = req.body;
    db.run('INSERT INTO cars (make, model, year, price) VALUES (?, ?, ?, ?)', car.make, car.model, car.year, car.price,  function(err) {
      if (err) {
        res.status(500).send(err);
      } else {
        car.id = this.lastID;
        res.send(car);
      }
    });
});

app.put('/cars/:id', (req, res) => {
    const car = req.body;
    db.run('UPDATE cars SET make = ?, model = ?, year = ?, price = ? WHERE id = ?',car.make, car.model, car.year, car.price,  function(err) {
        if (err) {
            res.status(500).send(err);
        } else {
            res.send(car);
        }
    });
});

app.delete('/cars/:id', (req, res) => {
    db.run('DELETE FROM cars WHERE id = ?', req.params.id, function(err) {
        if (err) {
            res.status(500).send(err);
        }   else {
            res.send({});
        }
    });
});

//table2 


db.run(`CREATE TABLE IF NOT EXISTS owners (
    id INTEGER PRIMARY KEY,
    name TEXT,
    age INTEGER
)`);

app.get('/owners', (req, res) => {
    db.all('SELECT * FROM owners', (err, rows) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(rows);
        }
    });
});

app.get('/owners/:id', (req,res) => {
    db.get('SELECT * FROM owners WHERE id = ?', req.params.id, (err, row) => {
        if (err) {
            res.status(500).send(err);
        } else {
            if (!row) {
                res.status(404).send('Owner not found');
            } else {
                res.json(row);
            }
        }
    });
});

app.post('/owners', (req, res) => {
    const owner = req.body;
    db.run('INSERT INTO owners (name, age) VALUES (?, ?)', owner.name, owner.age,  function(err) {
      if (err) {
        res.status(500).send(err);
      } else {
        owner.id = this.lastID;
        res.send(owner);
      }
    });
});

app.put('/owners/:id', (req, res) => {
    const owner = req.body;
    db.run('UPDATE owners SET name = ?, age = ? WHERE id = ?',owner.name, owner.age, req.params.id,  function(err) {
        if (err) {
            res.status(500).send(err);
        } else {
            res.send(owner);
        }
    });
});

app.delete('/owners/:id', (req, res) => {
    db.run('DELETE FROM owners WHERE id = ?', req.params.id, function(err) {
        if (err) {
            res.status(500).send(err);
        }   else {
            res.send({});
        }
    });
});


//table3

db.run(`CREATE TABLE IF NOT EXISTS results (
    id INTEGER PRIMARY KEY,
    id_owner INTEGER,
    id_car INTEGER
)`);

app.get('/results', (req, res) => {
    db.all('SELECT * FROM results', (err, rows) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(rows);
        }
    });
});

app.get('/results/:id', (req,res) => {
    db.get('SELECT * FROM results WHERE id = ?', req.params.id, (err, row) => {
        if (err) {
            res.status(500).send(err);
        } else {
            if (!row) {
                res.status(404).send('Result not found');
            } else {
                res.json(row);
            }
        }
    });
});

app.post('/results', (req, res) => {
    const result = req.body;
    db.run('INSERT INTO results (id_owner, id_car) VALUES (?, ?)', result.id_owner, result.id_car,  function(err) {
      if (err) {
        res.status(500).send(err);
      } else {
        result.id = this.lastID;
        res.send(result);
      }
    });
});
app.put('/results/:id', (req, res) => {
    const result = req.body;
    db.run('UPDATE results SET id_owner = ?, id_car = ? WHERE id = ?',result.id_owner, result.id_car, req.params.id,  function(err) {
        if (err) {
            res.status(500).send(err);
        } else {
            res.send(result);
        }
    });
});

app.delete('/results/:id', (req, res) => {
    db.run('DELETE FROM results WHERE id = ?', req.params.id, function(err) {
        if (err) {
            res.status(500).send(err);
        }   else {
            res.send({});
        }
    });
});

//summary
app.get('/summary', (req, res) => {
    db.all(
    `SELECT owners.name AS owner_name, GROUP_CONCAT(cars.model) AS cars_model
    FROM results
    INNER JOIN owners ON results.id_owner = owners.id
    INNER JOIN cars ON results.id_car = cars.id
    GROUP BY owners.id`
    , (err, rows) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(rows);
            
        }
    });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
// Dependencies
var express = require('express');
var bodyParser = require("body-parser");
var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;

// MongoDB
var url = "mongodb://Tietje:74644969Dk@ds147190.mlab.com:47190/handball";


//Port
var port = process.env.PORT || 9113;

// Express
var app = express();

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

app.use(bodyParser.json());

// Routes Frontend
//Route to public html/css under the public folder
app.use('/', express.static(__dirname + '/public'));


// Routes Backend


// Teams

// Find all teams
app.get('/teams', function(req, res) {


    // Create connection to MongoDB
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("handball");
        dbo.collection("Teams").find({}).toArray(function(error, result) {
          if (err) throw err;
          console.log(result);
          res.send(result);
          db.close();
        });
      });


})

// Find one team
app.get('/teams/:id', function(req, res) {

    var teamId = new ObjectID(req.params.id);
    // Create connection to MongoDB
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("handball");
        dbo.collection("Teams").findOne({_id:teamId},function(error, result) {
          if (err) throw err;
          console.log(result);
          res.send(result);
          db.close();
   
        });
      });


});
// Find players by team
app.get('/teams/players/:teamId', function(req, res) {

    var teamId = req.params.teamId;
    // Create connection to MongoDB
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("handball");
        dbo.collection("Players").find({ team_id: teamId}).toArray(function(err, result) {
            if (err) throw err;
            console.log(result);
            res.send(result);
            db.close();
          });
        
      });


});


// Create new team
app.post('/teams/create', function(req, res) {
    
    // Create connection to MongoDB
        MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            var dbo = db.db("handball");
            dbo.collection("Teams").insertOne(req.body, function(err, reseult) {
                if (err) throw err;
                console.log("Team created");
                res.send("Team has been created");
                db.close();
                
              });
          });
    
})


// Players

// Find all players
app.get('/players', function(req, res) {


    // Create connection to MongoDB
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("handball");
        dbo.collection("Players").find({}).toArray(function(error, result) {
          if (err) throw err;
          console.log(result);
          res.send(result);
          db.close();
        });
      });


})

// Find one player
app.get('/players/:id', function(req, res) {

    var playerId = new ObjectID(req.params.id);
    // Create connection to MongoDB
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("handball");
        dbo.collection("Players").findOne({_id:playerId},function(error, result) {
          if (err) throw err;
          console.log(result);
          res.send(result);
          db.close();
   
        });
      });


});

// Update single player
app.put('/players/:id/update', function(req, res) {

    var playerId = new ObjectID(req.params.id);

    var newValues = { $set: {
                        saves: req.body.saves,
                        goals: req.body.goals,
                            } 
                    };
    // Create connection to MongoDB
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("handball");
        dbo.collection("Players").updateOne({_id:playerId}, newValues,function(error, result) {
          if (err) throw err;
          console.log("Updated player");
          res.send(result);
          db.close();
    
        });
      }); 


});

// Update single player data
app.put('/players/:id/updateData', function(req, res) {

    var playerId = new ObjectID(req.params.id);

    var newValues = { $set: {
                        name: req.body.name,
                        position: req.body.position,
                        img: req.body.img,
                        team_id: req.body.team_id,
                        description: req.body.description,
                            } 
                    };
    // Create connection to MongoDB
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("handball");
        dbo.collection("Players").updateOne({_id:playerId}, newValues,function(error, result) {
          if (err) throw err;
          console.log("Updated player");
          res.send(result);
          db.close();
    
        });
      }); 


});

// Create new player
app.post('/players/create', function(req, res) {
    
    // Create connection to MongoDB
        MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            var dbo = db.db("handball");
            dbo.collection("Players").insertOne(req.body, function(err, reseult) {
                if (err) throw err;
                console.log("Player created");
                res.send("Player has been created");
                db.close();
                
              });
          });
    
})
// Delete single player
app.delete('/players/:id/delete', function(req, res) {

    var playerId = new ObjectID(req.params.id);

    // Create connection to MongoDB
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("handball");
        dbo.collection("Players").deleteOne({_id:playerId}, function(error, result) {
          if (err) throw err;
          console.log("Deleted player");
          res.send(result);
          db.close();
    
        });
      }); 


});
// Find all matches
app.get('/matches', function(req, res) {


    // Create connection to MongoDB
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("handball");
        dbo.collection("Matches").find({}).toArray(function(error, result) {
          if (err) throw err;
          console.log(result);
          res.send(result);
          db.close();
        });
      });


})
// Find livescore match
app.get('/matches/live', function(req, res) {

    // Create connection to MongoDB
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("handball");
        dbo.collection("Matches").findOne({live:true},function(error, result) {
          if (err) throw err;
          console.log(result);
          res.send(result);
          db.close();
   
        });
      });


});


// Find one match
app.get('/matches/:id', function(req, res) {

    var matchId = new ObjectID(req.params.id);
    // Create connection to MongoDB
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("handball");
        dbo.collection("Matches").findOne({_id:matchId},function(error, result) {
          if (err) throw err;
          console.log(result);
          res.send(result);
          db.close();
   
        });
      });


});


// Update single match
app.put('/matches/:id/update', function(req, res) {

    var matchId = new ObjectID(req.params.id);

    var newValues = { $set: {
                        homeTeamScore: req.body.homeTeamScore,
                        awayTeamScore: req.body.awayTeamScore,
                        time: req.body.time,
                        players: req.body.players,
                        vote: req.body.vote,
                        live: req.body.live,
                            } 
                    };
    // Create connection to MongoDB
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("handball");
        dbo.collection("Matches").updateOne({_id:matchId}, newValues,function(error, result) {
          if (err) throw err;
          console.log("Updated match");
          res.send(result);
          db.close();
    
        });
      }); 


});
// Create vote
app.post('/vote', function(req, res) {

    /*
    {
        match_id: match_id,
        player_id: match_id,
        name: name,
        phone: phone,
        email: email,
    }
    */
    // Create connection to MongoDB
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("handball");
        dbo.collection("Votes").insertOne(req.body, function(error, result) {
          if (err) throw err;
          console.log("Vote created");
          res.send(result);
          db.close();
    
        });
      }); 


});
// Find all votes
app.get('/vote', function(req, res) {

  
    // Create connection to MongoDB
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("handball");
        dbo.collection("Votes").find({}).toArray(function(error, result) {
          if (err) throw err;
          console.log(result);
          res.send(result);
          db.close();
        });
      });


});
// Find votes for one match
app.get('/vote/match/:id', function(req, res) {

  
    var matchId = req.params.id;
    // Create connection to MongoDB
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("handball");
        dbo.collection("Votes").find({match_id:matchId}).toArray(function(err, result) {
            if (err) throw err;
            console.log(result);
            res.send(result);
            db.close();
          });
        
      });

});
// Find votes for one match and player
app.get('/vote/match/:id/player/:playerId', function(req, res) {

  
    var matchId = req.params.id;
    var playerId = req.params.playerId;
    // Create connection to MongoDB
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("handball");
        dbo.collection("Votes").find({match_id:matchId, player_id: playerId}).toArray(function(err, result) {
            if (err) throw err;
            console.log(result);
            res.send(result);
            db.close();
          });
        
      });

});
// Update single match with player votes
app.put('/matches/:id/update/votes', function(req, res) {

    var matchId = new ObjectID(req.params.id);

    var newValues = { $set: {
                        playerVotes: req.body.playerVotes
                            } 
                    };
    // Create connection to MongoDB
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("handball");
        dbo.collection("Matches").updateOne({_id:matchId}, newValues,function(error, result) {
          if (err) throw err;
          console.log("Updated match");
          res.send(result);
          db.close();
    
        });
      }); 


});


// Delete single match
app.delete('/matches/:id/delete', function(req, res) {

    var matchId = new ObjectID(req.params.id);

    // Create connection to MongoDB
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("handball");
        dbo.collection("Matches").deleteOne({_id:matchId}, function(error, result) {
          if (err) throw err;
          console.log("Deleted match");
          res.send(result);
          db.close();
    
        });
      }); 


});
// Create new match
app.post('/matches/create', function(req, res) {
    req.body.vote = false;
    // Create connection to MongoDB
        MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            var dbo = db.db("handball");
            dbo.collection("Matches").insertOne(req.body, function(err, result) {
                if (err) throw err;
                console.log("Match created");
                res.send(result.ops[0]);
                db.close();
                
              });
          });
    
})

// Users

// Create new user
app.post('/users/create', function(req, res) {
    console.log(req.body)
    // Create connection to MongoDB
        MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            var dbo = db.db("handball");
            dbo.collection("Users").insertOne(req.body, function(err, result) {
                if (err) throw err;
                console.log(result.ops[0]);
                res.send(result.ops[0]);
                db.close();
                
              });
          });
    
})
// Login user
app.post('/users/login', function(req, res) {

    // Create connection to MongoDB
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("handball");
        dbo.collection("Users").findOne({email:req.body.email},function(error, result) {
            if(error){
                throw error
            }
            console.log(req.body.password);
            console.log(result);
            if(result && result.password == req.body.password){
                res.send(result);
                console.log("Success");
            }   else {
                res.send({"error":"invalid password"});
            }
            
            
        });
      });
    
})

// this is new

// Start server
app.listen(port);
console.log("Handball API is running on port " + port); 


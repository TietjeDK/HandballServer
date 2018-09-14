    // Bootstrap
    $('#myModal').on('shown.bs.modal', function () {
        $('#myInput').focus()
      })
	// create the module and name it scotchApp
	var scotchApp = angular.module('scotchApp', ['ngRoute']);
    scotchApp.filter('formatTimer', function() {
        return function(input)
          {
              function z(n) {return (n<10? '0' : '') + n;}
              var seconds = input % 60;
              var minutes = Math.floor(input / 60);
              var hours = Math.floor(minutes / 60);
              return (z(hours) +':'+z(minutes)+':'+z(seconds));
          };
      });
      
	// configure our routes
	scotchApp.config(function($routeProvider) {
		$routeProvider

			// route for the home page
			.when('/', {
				templateUrl : './pages/home.html',
				controller  : 'mainController'
            })
            // route for livescore
			.when('/livescore', {
				templateUrl : './pages/liveScore.html',
                controller  : 'scoreCtrl',
                
			})

			// route for the about page
			.when('/teams', {
				templateUrl : './pages/teams.html',
				controller  : 'teamsCtrl'
			})
            // route for the about page
			.when('/teams/:id', {
				templateUrl : './pages/singleTeam.html',
				controller  : 'teamsCtrl'
            })
            // route for the about page
			.when('/teams/:id/players', {
				templateUrl : './pages/teamPlayers.html',
				controller  : 'teamsCtrl'
			})
			// route for the contact page
			.when('/players', {
				templateUrl : './pages/players.html',
				controller  : 'playerCtrl'
            })
            .when('/players/:id', {
				templateUrl : './pages/singlePlayer.html',
				controller  : 'playerCtrl'
            })
            // route for the contact page
			.when('/createPlayer', {
				templateUrl : './pages/createPlayer.html',
				controller  : 'playerCtrl'
            })
            .when('/matches', {
				templateUrl : './pages/matches.html',
				controller  : 'matchCtrl'
            })
            // route for the about page
			.when('/matches/:id', {
				templateUrl : './pages/singleMatch.html',
				controller  : 'matchCtrl'
            })
            // route for the about page
			.when('/matches/:id/votes', {
				templateUrl : './pages/votes.html',
				controller  : 'matchCtrl'
			})
            .when('/createMatch', {
				templateUrl : './pages/createMatch.html',
				controller  : 'matchCtrl'
            })
            // route for the contact page
			.when('/createTeam', {
				templateUrl : './pages/createTeam.html',
				controller  : 'teamsCtrl'
			});
	});

	// create the controller and inject Angular's $scope
	scotchApp.controller('mainController', function($scope, $http) {
		// create a message to display in our view
        $scope.message = 'Everyone come and see how good I look!';
        
    
	});

	scotchApp.controller('teamsCtrl', function($scope, $http, $routeParams) {
        
        var teamId = $routeParams.id;
            // Get all teams
            $http({
                method: "GET",
                url: "http://178.62.243.55:9113/teams",
                headers: {
                "Accept": "application/json;odata=verbose"
                }
            }).then(function (response){
                console.log(response.data);
                $scope.teams = response.data;
            });

            if(teamId){
                // Get all players for one team
                $http({
                    method: "GET",
                    url: "http://178.62.243.55:9113/teams/players/" + teamId,
                    headers: {
                    "Accept": "application/json;odata=verbose"
                    }
                }).then(function (response){
                    console.log(response.data);
                    $scope.teamPlayers = response.data;
                });
                }


            // Reses form
            $scope.reset = function(){

            }
            // Create new team
            $scope.createTeam = function(data){
                // In beta set team name to Kolding Håndbold Klub
                data.name = "Kolding Håndbold Klub"

                $http({
                    method: "POST",
                    url: "http://178.62.243.55:9113/teams/create",
                    data: data,
                    headers: {
                    "Accept": "application/json;odata=verbose"
                    }
                }).then(function (response){
                    console.log(response);
                });
    
            }

    
	});

	scotchApp.controller('playerCtrl', function($scope, $http, $routeParams) {

        var playerId = $routeParams.id;
        
        // Get all teams
        $http({
            method: "GET",
            url: "http://178.62.243.55:9113/teams",
            headers: {
            "Accept": "application/json;odata=verbose"
            }
        }).then(function (response){
            console.log(response.data);
            $scope.teams = response.data;
        });


        // Get all players
        $http({
            method: "GET",
            url: "http://178.62.243.55:9113/players",
            headers: {
            "Accept": "application/json;odata=verbose"
            }
        }).then(function (response){
            console.log(response.data);
            $scope.players = response.data;
        });

        // If route param is set
        if(playerId){

            // Get one player
        $http({
            method: "GET",
            url: "http://178.62.243.55:9113/players/" + playerId,
            headers: {
            "Accept": "application/json;odata=verbose"
            }
        }).then(function (response){
            console.log(response.data);
            $scope.currentPlayer = response.data;
        });
        }

        // Find team
        $scope.findTeam = function(teamId, teams){
            console.log(teamId);
            for (let index = 0; index < teams.length; index++) {
                if(teamId == teams[index]._id){
                    return teams[index].division + " " + teams[index].gender;
                }                
            }
        }
        // Create new player
        $scope.createPlayer = function(data){
                // Default player values
                data.saves = 0;
                data.goals = 0;
                data.matches = 0;
            $http({
                method: "POST",
                url: "http://178.62.243.55:9113/players/create",
                data: data,
                headers: {
                "Accept": "application/json;odata=verbose"
                }
            }).then(function (response){
                console.log(response);
            });

        }
        // Update  player
        $scope.updatePlayer = function(data){
        
        $http({
            method: "PUT",
            url: "http://178.62.243.55:9113/players/" + data._id + "/updateData",
            data: data,
            headers: {
            "Accept": "application/json;odata=verbose"
            }
        }).then(function (response){
            console.log(response);
        });

    }
        $scope.deletePlayer = function(id){
            $http({
               method: "DELETE",
               url: "http://178.62.243.55:9113/players/" + id + "/delete",
               headers: {
               "Accept": "application/json;odata=verbose"
               }
           }).then(function (response){
               console.log(response.data);
           });
       }
    });
    
    scotchApp.controller('matchCtrl', function($scope, $http, $routeParams, $timeout, $location, $interval) {
        
        $scope.goToVotes = function(){
            $location.path('/matches/' + $routeParams.id + '/votes')
        }

        var matchId = $routeParams.id;
        // Get all matches
        $http({
            method: "GET",
            url: "http://178.62.243.55:9113/matches",
            headers: {
            "Accept": "application/json;odata=verbose"
            }
        }).then(function (response){

            $scope.matches = response.data;
        });
        
        if(matchId){
            // Get single match
            $http({
                method: "GET",
                url: "http://178.62.243.55:9113/matches/" + matchId,
                headers: {
                "Accept": "application/json;odata=verbose"
                }
            }).then(function (response){

                $scope.currentMatch = response.data;
                $scope.counter = $scope.currentMatch.time;
           
                    

            });
            }


        // Get all teams
        $http({
            method: "GET",
            url: "http://178.62.243.55:9113/teams",
            headers: {
            "Accept": "application/json;odata=verbose"
            }
        }).then(function (response){

            $scope.teams = response.data;
        });





        // Get all players
        $http({
            method: "GET",
            url: "http://178.62.243.55:9113/players",
            headers: {
            "Accept": "application/json;odata=verbose"
            }
        }).then(function (response){
            console.log(response.data);
            $scope.players = response.data;
        });

        // Close voting
        $scope.voteStatus = function(value){
            $scope.currentMatch.vote = value;
            $http({
                method: "PUT",
                url: "http://178.62.243.55:9113/matches/" +$scope.currentMatch._id + "/update",
                data: $scope.currentMatch,
                headers: {
                "Accept": "application/json;odata=verbose"
                }
            }).then(function (response){
                console.log(response);
            });
        }

         // Livescore
         $scope.live = function(value){
            $scope.currentMatch.live = value;
            $http({
                method: "PUT",
                url: "http://178.62.243.55:9113/matches/" +$scope.currentMatch._id + "/update",
                data: $scope.currentMatch,
                headers: {
                "Accept": "application/json;odata=verbose"
                }
            }).then(function (response){
                console.log(response);
                

            });
        }


        // Create new match
        $scope.createMatch = function(data){
            
            var item = JSON.parse(data.item);
            // Default match values
            data.status = "Afventer";
            data.homeTeamScore = 0;
            data.homeTeamId = item._id;
            data.homeTeamName = item.name + " " + item.division + " " + item.gender;
            data.awayTeamScore = 0;
            data.time = 0;
            data.players = [];
            data.item = JSON.parse(data.item);
            console.log(data);
            $http({
                method: "POST",
                url: "http://178.62.243.55:9113/matches/create",
                data: data,
                headers: {
                "Accept": "application/json;odata=verbose"
                }
            }).then(function (response){
                console.log(response);
                //$location.path('/matches/' + response.data._id)
            });

        }

        // Add player to match
        $scope.addPlayers = function(player){
            console.log(player);
            $scope.currentMatch.players.push(player);
            
            $http({
                method: "PUT",
                url: "http://178.62.243.55:9113/matches/" +$scope.currentMatch._id + "/update",
                data: $scope.currentMatch,
                headers: {
                "Accept": "application/json;odata=verbose"
                }
            }).then(function (response){
                console.log(response);
            });
        }

        // Remove player from match
        $scope.removePlayers = function(index){

            $scope.currentMatch.players.splice(index,1);
            
            $http({
                method: "PUT",
                url: "http://178.62.243.55:9113/matches/" +$scope.currentMatch._id + "/update",
                data: $scope.currentMatch,
                headers: {
                "Accept": "application/json;odata=verbose"
                }
            }).then(function (response){
                console.log(response);
            });
        }

        // Add goal
        $scope.addGoal = function(index){

            $scope.currentMatch.players[index].goals++ 
                    $http({
                        method: "PUT",
                        url: "http://178.62.243.55:9113/matches/" +$scope.currentMatch._id + "/update",
                        data: $scope.currentMatch,
                        headers: {
                        "Accept": "application/json;odata=verbose"
                        }
                    }).then(function (response){
                        console.log(response);
                    });
           



        }
        // Add goal
        $scope.removeGoal = function(index){

            $scope.currentMatch.players[index].goals-- 
                    $http({
                        method: "PUT",
                        url: "http://178.62.243.55:9113/matches/" +$scope.currentMatch._id + "/update",
                        data: $scope.currentMatch,
                        headers: {
                        "Accept": "application/json;odata=verbose"
                        }
                    }).then(function (response){
                        console.log(response);
                    });
           

        }

        // Add save
        $scope.addSave = function(index){

            $scope.currentMatch.players[index].saves++ 
                    $http({
                        method: "PUT",
                        url: "http://178.62.243.55:9113/matches/" +$scope.currentMatch._id + "/update",
                        data: $scope.currentMatch,
                        headers: {
                        "Accept": "application/json;odata=verbose"
                        }
                    }).then(function (response){
                        console.log(response);
                    });
           

        }
        // Add goal
        $scope.removeSave = function(index){

            $scope.currentMatch.players[index].saves-- 
                    $http({
                        method: "PUT",
                        url: "http://178.62.243.55:9113/matches/" +$scope.currentMatch._id + "/update",
                        data: $scope.currentMatch,
                        headers: {
                        "Accept": "application/json;odata=verbose"
                        }
                    }).then(function (response){
                        console.log(response);
                    });
           

        }

        // Increase score
        $scope.increaseScore = function(matchId, team){
            
            if(team == "homeTeam"){
          
                    $scope.currentMatch.homeTeamScore++;
                    $http({
                        method: "PUT",
                        url: "http://178.62.243.55:9113/matches/" +$scope.currentMatch._id + "/update",
                        data: $scope.currentMatch,
                        headers: {
                        "Accept": "application/json;odata=verbose"
                        }
                    }).then(function (response){
                        console.log(response);
                    });
           
            } else if (team == "awayTeam"){
                
                    $scope.currentMatch.awayTeamScore++;
                    $http({
                        method: "PUT",
                        url: "http://178.62.243.55:9113/matches/" +$scope.currentMatch._id + "/update",
                        data: $scope.currentMatch,
                        headers: {
                        "Accept": "application/json;odata=verbose"
                        }
                    }).then(function (response){
                        console.log(response);
                    });
           
            } 

        }
         // Decrease score
         $scope.decreaseScore = function(matchId, team){
            console.log(team)
            if(team == "homeTeam"){
          
                    $scope.currentMatch.homeTeamScore--;
                    $http({
                        method: "PUT",
                        url: "http://178.62.243.55:9113/matches/" +$scope.currentMatch._id + "/update",
                        data: $scope.currentMatch,
                        headers: {
                        "Accept": "application/json;odata=verbose"
                        }
                    }).then(function (response){
                       
                    });
           
           
            } else if (team == "awayTeam"){
                
                    $scope.currentMatch.awayTeamScore--;
                    $http({
                        method: "PUT",
                        url: "http://178.62.243.55:9113/matches/" +$scope.currentMatch._id + "/update",
                        data: $scope.currentMatch,
                        headers: {
                        "Accept": "application/json;odata=verbose"
                        }
                    }).then(function (response){
                      
                    });
           
            } 

        }
        // Find team
        $scope.findTeam = function(teamId, teams){
            for (let index = 0; index < teams.length; index++) {
                if(teamId == teams[index]._id){
                    return teams[index].division + " " + teams[index].gender;
                }                
            }
        }
        Array.prototype.hasElement = function(element) {
            var i;
            for (i = 0; i < this.length; i++) {
                if (this[i] === element) {
                    return i; //Returns element position, so it exists
                }
            }
        }

        // check if player is already added to macth
        function playerAdded(arr, id) {
            return arr.some(function(el) {
              return el._id === id;
            }); 
          }

        $scope.isAdded = function(item) {
            return playerAdded($scope.currentMatch.players, item._id);
            
        }

    
   // Match time counter
    var stopped;
    
    $scope.timerRunning = false;

    $scope.countdown = function() {

        $scope.timerRunning = true;
        stopped = $timeout(function() {
        
        console.log($scope.counter);
        $scope.counter++;   
        $scope.countdown();
        $scope.currentMatch.time = $scope.counter;
        $http({
            method: "PUT",
            url: "http://178.62.243.55:9113/matches/" +$scope.currentMatch._id + "/update",
            data: $scope.currentMatch,
            headers: {
            "Accept": "application/json;odata=verbose"
            }
        }).then(function (response){
            
        });    

        }, 1000);
    };
    
        
    $scope.stop = function(){
    $scope.timerRunning = false;
    $timeout.cancel(stopped);
    }; 


    $scope.deleteMatch = function(id){
         // Get single match
         $http({
            method: "DELETE",
            url: "http://178.62.243.55:9113/matches/" + id + "/delete",
            headers: {
            "Accept": "application/json;odata=verbose"
            }
        }).then(function (response){
            console.log(response.data);
        });
    }

    $scope.getWinner = function(){
        var winnerArray = [];
        for (let i = 0; i < $scope.currentMatch.players.length; i++) {
            console.log($scope.currentMatch.players[i].vote.length);
            winnerArray.push({"name" : $scope.currentMatch.players[i].name, "number": $scope.currentMatch.players[i].vote.length, "votes": $scope.currentMatch.players[i].vote})
        }
        winnerArray.sort(function(a, b) {
            return parseFloat(b.votes.length) - parseFloat(a.votes.length);
        });;

         var rand = winnerArray[0].votes[Math.floor(Math.random() * winnerArray[0].votes.length)];
         $scope.winner = rand;
         $scope.currentMatch.priceWinner = rand;
    }
    // Get votes
    $interval(function() {
    if(matchId){
        for (let i = 0; i < $scope.currentMatch.players.length; i++) {
            const player =  $scope.currentMatch.players[i];
            $http({
                method: "GET",
                url: "http://178.62.243.55:9113/vote/match/" + $scope.currentMatch._id + "/player/" + player._id,
                headers: {
                "Accept": "application/json;odata=verbose"
                }
            }).then(function (response){
                
                $scope.currentMatch.players[i].vote = response.data;
            });
        }
        console.log($scope.currentMatch.players)
     
    
    }
    }, 10000);


    });
    
        
    scotchApp.controller('scoreCtrl', function($scope, $http, $routeParams, $timeout, $location, $interval) {
        $interval(function() {
         // Get match
         $http({
            method: "GET",
            url: "http://178.62.243.55:9113/matches/live",
            headers: {
            "Accept": "application/json;odata=verbose"
            }
        }).then(function (response){
            console.log(response.data);
            $scope.match = response.data;
        });
    }, 5000);

    })
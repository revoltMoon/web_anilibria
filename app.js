window.addEventListener('load', function() {
  var content = document.querySelector('.content');
  var loadingSpinner = document.getElementById('loading');
  content.style.display = 'block';
  loadingSpinner.style.display = 'none';

  var homeView = document.getElementById('homeView');
  var anime = document.getElementById('anime');
  // buttons
  var homeBtn = document.getElementById('homeBtn');
  var loginBtn = document.getElementById('loginBtn');
  var logoutBtn = document.getElementById('logoutBtn');
  var profileBtn = document.getElementById('profileBtn');

  logoutBtn.style.display = 'none';

  var lock = new Auth0Lock(
  'tzwQhlg0V3yzySAQe92rADhvpDees0oW',
  'revoltmoon.eu.auth0.com'
  );

  if (localStorage.getItem('profileName') !== null) {
  	$("#profileBtn").html(localStorage.getItem('profileName'));
  	loginBtn.style.display = 'none';
  	logoutBtn.style.display = 'block';
  }

  if (localStorage.getItem('animeIdToNextPage') !== null) {
  	var cartoonId = localStorage.getItem('animeIdToNextPage');
  	console.log(cartoonId);
  	var cartoonData = JSON.parse(localStorage.getItem(cartoonId));
  	console.log(cartoonData);
  	console.log(cartoonData["cartoonName"]);
  	var cartoon = $('.animka').last();
  	cartoon.find(".anime-title").last().text(cartoonData["cartoonName"]);
    cartoon.find("img").last().attr({
        'src' : cartoonData["cartoonImgUrl"]
    });
    cartoon.find(".anime-description").last().text(cartoonData["cartoonDescription"]);
  }

  lock.on("authenticated", function(authResult) {
    // Use the token in authResult to getUserInfo() and save it to localStorage
    lock.getUserInfo(authResult.accessToken, function(error, profile) {
      if (error) {

        return;
      }
      $("#profileBtn").html(profile.nickname);
      loginBtn.style.display = 'none';
  	  logoutBtn.style.display = 'block';
      getUserCartoons(profile.nickname);
      localStorage.setItem('accessToken', authResult.accessToken);
      localStorage.setItem('profile', JSON.stringify(profile));
      localStorage.setItem('profileName', profile.nickname);
    });
  });
  
  var config = {
    apiKey: "AIzaSyD2Lp_QC8a4jWHsy6GOZdN0sWjXLLihXy8",
    authDomain: "anilibria-1e924.firebaseapp.com",
    databaseURL: "https://anilibria-1e924.firebaseio.com",
    projectId: "anilibria-1e924",
    storageBucket: "anilibria-1e924.appspot.com",
    messagingSenderId: "793792578918"
  };

  firebase.initializeApp(config);

  var database = firebase.database();

  receiveCartoons();

  homeBtn.addEventListener('click', function() {
  	localStorage.removeItem('animeIdToNextPage');
  	window.location.replace("https://anilibria.now.sh");
  });

  loginBtn.addEventListener('click', function() {
    lock.show();
  });

  logoutBtn.addEventListener('click', function() {
    lock.logout();
    localStorage.removeItem('accessToken');
    localStorage.removeItem('profile');
    localStorage.removeItem('profileName');
    logoutBtn.style.display = 'none';
    loginBtn.style.display = 'block';
  });

  $(document).on('click', '.anime-title', function() {
  	var cartoonId = $(this).attr("id");
  	localStorage.setItem('animeIdToNextPage', cartoonId);
  	window.location.replace("https://anilibria.now.sh/anime.html");
  });

  function receiveCartoons() {
    var ref = database.ref('cartoons');
    ref.once("value")
        .then(function(snapshot) {
            var obj = snapshot.val();
            for (var item in obj) {
              var cartoon = obj[item];
              var clone = $(".anime").last();
              clone.clone().appendTo(".homeView");
              clone.find(".anime-title").last().text(cartoon["cartoonName"]);
              clone.find("img").last().attr({
                'src' : cartoon["cartoonImgUrl"]
              });
              clone.find(".anime-title").last().attr({
                'id' : cartoon["cartoonID"]
              });
              var a = {
              	'cartoonDescription':cartoon["cartoonDescription"], 
              	'cartoonID':cartoon['cartoonID'], 
              	'cartoonImgUrl': cartoon['cartoonImgUrl'], 
              	'cartoonName': cartoon['cartoonName']
              };
              var cartoonId = cartoon['cartoonID'];
              localStorage.setItem(JSON.stringify(cartoonId), JSON.stringify(a));
              //console.log(localStorage.getItem(cartoonId));
            };
        });
  };

  function getUserCartoons(userName) {
  	var userRef = database.ref('users');
      userRef.once("value")
      	.then(function(snapshot) {
      		if (snapshot.child(userName).exists()) {
      			var obj = snapshot.val();
      			localStorage.setItem('favCartoonsID', obj[userName]['favCartoonsID']);
      		} else {
      			favCartoons = [0];
      			database.ref('users/' + userName).set({
      				'favCartoonsID': [0]
      			});
      		}
      	});
  }
});

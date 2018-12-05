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

  if (localStorage.getItem('profileName') !== null) {
  	$("#profileBtn").html(localStorage.getItem('profileName'));
  	loginBtn.style.display = 'none';
  	logoutBtn.style.display = 'block';
  }

  if (localStorage.getItem('animeIdToNextPage') !== null) {
    	var cartoonId = localStorage.getItem('animeIdToNextPage');

      console.log(cartoonId);
    	var cartoonData = JSON.parse(localStorage.getItem(cartoonId));
    	var cartoon = $('.animka').last();
      setCollectionView(cartoon, cartoonData);
      cartoon.find(".anime-description").last().text(cartoonData["cartoonDescription"]);
  }
  
  if (localStorage.getItem('profilePage') !== null) {
    localStorage.removeItem('profilePage');

    var favCartoons = localStorage.getItem('favCartoonsID');
    console.log(favCartoons);

    var ref = database.ref('cartoons/' + favCartoons);
    ref.once("value")
        .then(function(snapshot) {
              var cartoon = snapshot.val();
              var clone = $(".anime-in-profile").last();
              clone.clone().appendTo('profileView');
              setCollectionView(clone, cartoon);
        });
  }

  if (document.getElementById('favBtn')) {
        document.getElementById('favBtn').addEventListener('click', function() {
          // console.log(localStorage);
          // getUserCartoons(localStorage.getItem('profileName'));
          // var favCartoons = localStorage.getItem('favCartoonsID');
          // console.log(favCartoons);
          // console.log(JSON.parse(localStorage.getItem('favCartoonsID')));
          var cartoonId = localStorage.getItem('animeIdToNextPage');
          database.ref('users/' + localStorage.getItem('profileName')).set({
            'favCartoonsID': Array(cartoonId)
          });
        });
}

  lock.on("authenticated", function(authResult) {
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

  receiveCartoons();

  homeBtn.addEventListener('click', function() {
  	localStorage.removeItem('animeIdToNextPage');
  	window.location.replace("https://anilibria.now.sh");
  });

  loginBtn.addEventListener('click', function() {
    lock.show();
  });

  logoutBtn.addEventListener('click', function() {
    localStorage.clear();
    lock.logout();
    logoutBtn.style.display = 'none';
    loginBtn.style.display = 'block';
  });

  profileBtn.addEventListener('click', function() {
    localStorage.setItem('profilePage', "yes");
  	window.location.replace("https://anilibria.now.sh/profile.html");
  });

  $(document).on('click', '.anime-title', function() {
  	var cartoonId = $(this).attr("id");
  	localStorage.setItem('animeIdToNextPage', cartoonId);
  	window.location.replace("https://anilibria.now.sh/anime.html");
  });

  $(document).on('click', '.anime-image', function() {
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
              var clone = $('.anime').last();
              clone.clone().appendTo(".homeView");
              setCollectionView(clone, cartoon);

              var a = {
              	'cartoonDescription':cartoon["cartoonDescription"], 
              	'cartoonID':cartoon['cartoonID'], 
              	'cartoonImgUrl': cartoon['cartoonImgUrl'], 
              	'cartoonName': cartoon['cartoonName']
              };
              var cartoonId = cartoon['cartoonID'];
              localStorage.setItem(JSON.stringify(cartoonId), JSON.stringify(a));
            };
        });
  };

  function getUserCartoons(userName) {
  	var userRef = database.ref('users');
      userRef.once("value")
      	.then(function(snapshot) {
      		if (snapshot.child(userName).exists()) {
      			var obj = snapshot.val();
      			console.log(obj);
      			console.log(obj[userName]);
      			console.log(obj[userName]['favCartoonsID']);
      			localStorage.setItem('favCartoonsID', obj[userName]['favCartoonsID']);
      		} else {
      			database.ref('users/' + userName).set({
      				'favCartoonsID': [0]
      			});
      		}
      	});
  }

  function setCollectionView(cartoon, cartoonData) {
      cartoon.find(".anime-title").last().text(cartoonData["cartoonName"]);
      cartoon.find("img").last().attr({
          'src' : cartoonData["cartoonImgUrl"]
      });
      cartoon.find(".anime-title").last().attr({
          'id' : cartoonData["cartoonID"]
      });
      cartoon.find(".anime-image").last().attr({
          'id' : cartoonData["cartoonID"]
      });
  }  
});

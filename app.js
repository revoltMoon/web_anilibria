window.addEventListener('load', function() {
  var content = document.querySelector('.content');
  var loadingSpinner = document.getElementById('loading');
  content.style.display = 'block';
  loadingSpinner.style.display = 'none';

  var homeView = document.getElementById('homeView');
  var animeColumn = document.getElementById('anime')

  // buttons and event listeners
  var homeViewBtn = document.getElementById('homeBtn');
  var loginBtn = document.getElementById('loginBtn');
  var logoutBtn = document.getElementById('logoutBtn');

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

  homeViewBtn.addEventListener('click', function() {

    var ref = database.ref('cartoons');

    ref.once("value")
        .then(function(snapshot) {
            console.log(snapshot.val());
            var obj = snapshot.val()
            for (var item in obj) {
              var cartoon = obj[item];
              //homeView.innerHTML = cartoon["cartoonName"];
              var clone = $(".anime").last();
              clone.find(".anime-title").last().text(cartoon["cartoonName"]);
              clone.clone().appendTo(".homeView");
              clone.appendTo(".homeView")
            }
    });
  //var clone = $(".anime").last();//.clone().addClass('sao').removeClass('anime')
  //clone.find(".anime-title").last().text("3232");
 // clone.clone().appendTo(".homeView");
  //clone.appendTo(".homeView")
  // var text = $(".anime-title").clone()
  // text.text('232')
  // text.appendTo(".sao")//(".anime-name")
  //clone.appendTo(".homeView")
    //animeColumn.clone().insertAfter('');
    // var ref = database.ref('cartoons/100');
    // ref.once("value")
    //     .then(function(snapshot) {
    //     var cartoon = snapshot.child("userID").val(); 
    //     var cartoonIDs = snapshot.child("favCartoonsID").val();
    //     var snap = snapshot.val();
    //     homeView.innerHTML = snap["cartoonName"]+ "<br>" + snap["cartoonDescription"];
    // });
  });

  loginBtn.addEventListener('click', function(e) {
    lock.show();
    homeView.innerHTML = 'login';
  });

  logoutBtn.addEventListener('click', function(e) {
    lock.logout();
    homeView.innerHTML = 'logout';
    logoutBtn.style.display = 'none';
    loginBtn.style.display = 'block';
  });

  function setSession(authResult) {
  var expiresAt = JSON.stringify(
    authResult.expiresIn * 1000 + new Date().getTime()
  );
  localStorage.setItem('access_token', authResult.accessToken);
  localStorage.setItem('id_token', authResult.idToken);
  localStorage.setItem('expires_at', expiresAt);
  };

  // Listening for the authenticated event
  lock.on("authenticated", function(authResult) {
  // Use the token in authResult to getUserInfo() and save it to localStorage
  lock.getUserInfo(authResult.accessToken, function(error, profile) {
    if (error) {

      return;
    }
    setSession(authResult);
    loginBtn.style.display = 'none';
    logoutBtn.style.display = 'block';
    homeView.innerHTML = profile.nickname;
    });
  });
});

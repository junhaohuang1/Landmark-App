// Make sure we wait to attach our handlers until the DOM is fully loaded.

$(document).ready(function() {
  //get all the reviews for certain landmark
  var coordinates;

  $("#map").on("submit", $("#check-review"), function(event) {
    event.preventDefault();
    console.log("i shouldn't be here?");
    coordinates = $("#info-box").attr("data-lat") + $("#info-box").attr("data-lng");
    console.log("clicking something");
    $.ajax("/review/" + coordinates, {
      type: "GET"
    }).then(
      function() {
        // Reload the page to get the updated list
        console.log("i m here");
        location.assign("/review/" + coordinates);
      });
  });


  //submit reviews to sql
  $(".create-form").on("submit", function(event) {
    // Make sure to preventDefault on a submit event.
    event.preventDefault();
    console.log(window.location.href.substring(window.location.href.indexOf("view") + 5));
    var newReview = {
      location: window.location.href.substring(window.location.href.indexOf("view") + 5),
      author: $("#auth").val().trim(),
      title: $("#title").val().trim(),
      body: $("#body").val().trim()
    };

    // Send the POST request.
    $.ajax("/review/add", {
      type: "POST",
      data: newReview,
    }).then(
      function() {
        console.log("created new reivew");
        // Reload the page to get the updated list
        location.reload();
      }
    );
  });
  //update reviews
  $("#update-review").on("submit", function(event) {
    // Make sure to preventDefault on a submit event.
    event.preventDefault();

    var updatedQuote = {
      author: $("#auth").val().trim(),
      review: $("#review").val().trim()
    };

    var id = $(this).data("id");

    // Send the POST request.
    $.ajax("/api/review/update" + id, {
      type: "PUT",
      data: updatedQuote
    }).then(
      function() {
        console.log("updated quote");
        // Reload the page to get the updated list
        location.reload();
      }
    );
  });
});


// This example adds a search box to a map, using the Google Place Autocomplete
// feature. People can enter geographical searches. The search box will return a
// pick list containing a mix of places and predicted search terms.

// This example requires the Places library. Include the libraries=places
// parameter when you first load the API. For example:
// <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">

function initAutocomplete() {
  var socket = io.connect('http://' + window.location.hostname + ':' + window.location.port);
  var map = new google.maps.Map(document.getElementById('map'), {
    center: {
      lat: -33.8688,
      lng: 151.2195
    },
    zoom: 13,
    mapTypeId: 'roadmap'
  });

  // Create the search box and link it to the UI element.
  var input = document.getElementById('pac-input');
  var searchBox = new google.maps.places.SearchBox(input);
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

  // Bias the SearchBox results towards current map's viewport.
  map.addListener('bounds_changed', function() {
    searchBox.setBounds(map.getBounds());
  });
  var contentString = "";
  var markers = [];
  // Listen for the event fired when the user selects a prediction and retrieve
  // more details for that place.
  searchBox.addListener('places_changed', function() {
    var places = searchBox.getPlaces();

    if (places.length == 0) {
      return;
    }

    // Clear out the old markers.
    markers.forEach(function(marker) {
      marker.setMap(null);
    });
    markers = [];

    // For each place, get the icon, name and location.
    var bounds = new google.maps.LatLngBounds();
    places.forEach(function(place) {
      if (!place.geometry) {
        console.log("Returned place contains no geometry");
        return;
      }
      var icon = {
        url: place.icon,
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(25, 25)
      };

      // Create a marker for each place.

      var marker = new google.maps.Marker({
        map: map,
        icon: icon,
        title: place.name,
        position: place.geometry.location
      })
      //html for the info box from the place marker
      var placeName = place.name;
      var coordinates = marker.getPosition().lat() + marker.getPosition().lng();
      contentString = `<div id="info-box" data-lat=${marker.getPosition().lat()} data-lng=${marker.getPosition().lng()} <label>${place.name}<br>${place.formatted_address}<br></label><br><form><button method="GET" name="review" id="check-review" value=${coordinates} type="submit">Check Reviews</button></form></div>`

      var infowindow = new google.maps.InfoWindow({
        content: contentString,
        maxWidth: 200
      });
      marker.addListener('click', function() {
        infowindow.open(map, marker);
        console.log($("#info-box").attr("data-lat") + " " + $("#info-box").attr("data-lng"));
      });

      marker.addListener("click", function() {
        $('#tweet-container').empty();
        socket.emit("keyword-change", placeName);
        socket.on('twitter-stream', function(data) {
          var template = '<div class="row">' + '</div>';
          $.each(data, function() {
            if ($('#' + data.id).length) {
              return;
            }
            var tweet_view = $(template);
            if (data.id) {
              tweet_view.attr('id', data.id);
            }

            var imgTag = `<img src=${data.user.profile_image_url}>`
            tweet_view.append(imgTag);
            tweet_view.append(data.user.screen_name);
            tweet_view.append(data.text);

            // Add the tweet to the DOM
            $('#tweet-container').prepend(tweet_view);
          })
        });
      })


      if (place.geometry.viewport) {
        // Only geocodes have viewport.
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }
    });
    map.fitBounds(bounds);


  });
}

// Make sure we wait to attach our handlers until the DOM is fully loaded.
console.log("hi");
$(document).ready(function() {
    //get all the reviews for certain landmark
    $(".reviews").on("click", function(event) {
        var location = $(this).attr("data-name");
        $.ajax("/review/" + location, {
            type: "GET"
        }).then(
            function() {
                // Reload the page to get the updated list
                location.reload();
            }
        );
    });

    $(".submit-review").on("submit", function(event) {
        // Make sure to preventDefault on a submit event.
        event.preventDefault();

        var newReview = {
            location: $("location").val().trim(),
            title: $("title").val().trim(),
            body: $("#review").val().trim(),
            rating: 0
        };

        // Send the POST request.
        $.ajax("/review/add", {
            type: "POST",
            data: newQuote
        }).then(
            function() {
                console.log("created new review");
                // Reload the page to get the updated list
                location.reload();
            }
        );
    });

    $(".update-review").on("submit", function(event) {
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
                location.assign("/");
            }
        );
    });
    //ajax call to get the most top rated reviews
    $(".sort-by-top").click("submit", function(event) {
        event.preventDefault();
        var location = $(this).attr("data-name");
        $.ajax("/api/sort/top" + location, {
            type: "GET"
        }).then(
            function() {
                location.reload();
            }
        )
    });
    //ajax call to sort the reviews by most recent
    $(".sort-by-recent").click("submit", function(event) {
        event.preventDefault();
        var location = $(this).attr("data-name");
        $.ajax("/api/sort/recent" + location, {
            type: "GET"
        }).then(
            function() {
                location.reload();
            }
        )
    });
    //ajax call to update the rating of the review
    $(".update-rating").click("submit", function(event) {
        event.preventDefault();
        var id = $(this).data("id");
        var updatedRating = {
            rating: $(".rating").val().trim()
        };
        $.ajax("/api/rating/" + id, {
            type: "PUT",
            data: updatedRating
        }).then(
            function() {
                location.assign("/");
            })
    })
});


// This example adds a search box to a map, using the Google Place Autocomplete
// feature. People can enter geographical searches. The search box will return a
// pick list containing a mix of places and predicted search terms.

// This example requires the Places library. Include the libraries=places
// parameter when you first load the API. For example:
// <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">

function initAutocomplete() {
    var map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: -33.8688, lng: 151.2195 },
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
    var placename = "";
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

            placename = place.name;
            console.log(placename);
            //html for the infor box from the place marker
            contentString = '<div " data-name=' + placename + '>' + '<label>+' + place.name + '<br>' + place.formatted_address + "<br>" + 'Reviews</label> <br>' + '<input id="review" type="submit">' + "</div>"
            var infowindow = new google.maps.InfoWindow({
                content: contentString,
                maxWidth: 200
            });
            console.log(place.name);
            console.log(place.geometry.location);
            var marker = new google.maps.Marker({
                map: map,
                icon: icon,
                title: place.name,
                position: place.geometry.location
            })
            marker.addListener('click', function() {
                infowindow.open(map, marker);
            });
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
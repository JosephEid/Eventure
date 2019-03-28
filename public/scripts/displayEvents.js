function drawEvents() {
    var results = JSON.parse(localStorage.getItem('results'));
    $("#results").empty();
    for(var i=0; i < results.length; i++) {
        var $row = $("<div>", {"class": "row result"});
        $("#results").append($row);
        var $col4 = $("<div>", {"class": "col-4"});
        $row.append($col4);
        var $linkpic = $("<a>", {"href":"/restaurant", "class": "d-block mb-4 h-150"});
        $col4.append($linkpic);
        if (results[i].images[0]){
            var $img = $("<img>", {"class": "img-fluid", "src": results[i].images[0], "alt": "Image could not be loaded", "style": "width:100%;"});
        }else{
            var $img = $("<img>", {"class": "img-fluid", "src": "/images/no_image.jpg", "alt": "Image could not be loaded", "style": "width:100%;"});
        }

        $linkpic.append($img);
        var $col8 = $("<div>", {"class": "col-8"});
        $row.append($col8);
        var $linkname = $("<a>", {"href":"/restaurant/" + results[i].id +"/"+results[i].name});
        $linkname.append(document.createTextNode(results[i].name));
        $col8.append($linkname);
        var $prating = $("<p>");
        for(var j=0; j<results[i].rating; j++) {
            var $spanratingon = $("<span>", {"class": "fas fa-lemon checked"});
            $prating.append($spanratingon);
        }
        for(var j=0; j<5-results[i].rating; j++) {
            var $spanratingoff = $("<span>", {"class": "far fa-lemon checked"});
            $prating.append($spanratingoff);
        }
        var $spanreviews = $("<span>", {"class": "ml-1"});
        $spanreviews.append(document.createTextNode(results[i].no_of_ratings + " reviews"));
        $prating.append($spanreviews);
        $col8.append($prating);
        var $pcuisine = $("<p>");
        var text = results[i].cuisine[0];
        for (var j=1; j<results[i].cuisine.length; j++)
            text += ", " + results[i].cuisine[j];
        $pcuisine.append(document.createTextNode(text));
        $col8.append($pcuisine);
        var $pprice = $("<p>");
        for(var j=0; j<results[i].price; j++) {
            var $spanprice = $("<span>", {"class": "fas fa-pound-sign"});
            $pprice.append($spanprice);
        }
        $col8.append($pprice);
    }
}

/**
 * Uses Web RTC to take an image using the devices camera, draws it to canvas and sends to an ajax method
 */

function takePhoto(){
    if (hasGetUserMedia()) {
        document.getElementById('video').setAttribute("style","width:"+$('#photoSize').width()+"px");
        var video = document.querySelector('video');
        var canvas = document.querySelector('canvas');
        var ctx = canvas.getContext('2d');
        var ready = false;
        if (document.getElementById('video')!=null)
            document.getElementById('video').style.display='block';
        if (document.getElementById('load')!=null)
            document.getElementById('load').style.display='none';
        if (document.getElementById('take')!=null)
            document.getElementById('take').style.display='block';
        var errorCallback = function() {
            if (document.getElementById('noSupport')!=null)
                document.getElementById('noSupport').style.display='block';
        };
        var hdConstraints = {
            video: {
                mandatory: {
                    maxWidth: 1280,
                    maxHeight: 720
                }
            }
        }

        document.getElementById("take").addEventListener('click', snapshot, false);

        navigator.mediaDevices.getUserMedia(hdConstraints)
            .then(function(stream) {
                video.srcObject = stream;
                video.play();
                ready = true;
            })
            .catch(function(err) {
                errorCallback();
            });
        function snapshot() {
            if (ready) {
                canvas.width = $('#video').width();
                canvas.height = $('#video').height();
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                document.getElementById('takenPhoto').src = canvas.toDataURL('image/png');
                document.querySelector(".imagePreview").src = canvas.toDataURL('image/png');
                document.getElementById('photoBlob').value = canvas.toDataURL('image/png');
                var current_url = window.location.href.split("/");
                console.log(current_url);
                console.log(canvas.toDataURL('image/png'));
                //var id = current_url[1];
                var id = 1;
                imageBlob = canvas.toDataURL();
                document.getElementsByClassName("modal-backdrop").remove();
            }
        }
    } else {
        if (document.getElementById('noSupport')!=null)
            document.getElementById('noSupport').style.display='block';
    }
}
function previewFileSystem() {
    var preview = document.querySelector(".imagePreview");
    var file    = document.querySelector('input[type=file]').files[0];
    var field   = document.getElementById('photoBlob');
    var reader  = new FileReader();

    reader.addEventListener("load", function () {
        console.log(reader.result);
        preview.src = reader.result;
        field.value = reader.result;
    }, false);

    if (file) {
        reader.readAsDataURL(file);
    }
}
/**
 * Checks whether the users device is Web RTC compatible
 * @returns {boolean} The devices compatibility
 */
function hasGetUserMedia(){
    return !!(navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia ||
        navigator.msGetUserMedia);
}

function sendImage(id, imageBlob) {
    console.log(id);
    var data = {id: id, imageBlob: imageBlob, fromFile: false};
    $.ajax({
        dataType: "json",
        url: '/image',
        type: "POST",
        data: data,
        success: function (dataR) {
            var results = JSON.parse(localStorage.results);
            for (var i = 0; i < results.length; i++) {
                if(dataR.id == results[i].id){
                    results[i].images.push(dataR.images[dataR.images.length-1]);
                    displayImages(results[i])
                }
            }
            localStorage.setItem("results", JSON.stringify(results));
            $('#photo').modal('toggle');
        },
        error: function (err) {
            addToImageBacklog(data);
            $('#photo').modal('toggle');
        }
    });
}
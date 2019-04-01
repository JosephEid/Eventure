// newPhoto.js - contains the functions which are related to capturing a photo from the webcam and sending it to the views in a way that can be stored.

/**
 * Uses Web RTC to take an image using the devices camera, draws it to canvas and sends it as a photoBlob for an image preview
 * and as a value for the photo which is to be posted to the database.
 */
function takePhoto(){
    if (checkCompatibility()) {
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
                //displays the image as the most recently taken photo
                document.getElementById('takenPhoto').src = canvas.toDataURL('image/png');
                //displays the image on the image preview
                document.querySelector(".imagePreview").src = canvas.toDataURL('image/png');
                //fills the photoBlob field with the photoBlob to be posted to the database
                document.getElementById('photoBlob').value = canvas.toDataURL('image/png');
                document.getElementsByClassName("modal-backdrop").remove();
            }
        }
    } else {
        if (document.getElementById('noSupport')!=null)
            document.getElementById('noSupport').style.display='block';
    }
}

/**
 * Converts an image selected from the filesystem into a photoBlob which can be stored in the database
 * and previewed on the views page.
 */
function previewFileSystem() {
    // the preview image tag
    var preview = document.querySelector(".imagePreview");

    // the file selected on the views
    var file    = document.querySelector('input[type=file]').files[0];

    // the input field for the photoBlob
    var field   = document.getElementById('photoBlob');

    // initialise a file reader.
    var reader  = new FileReader();

    // updates the image preview and input field on the form.
    reader.addEventListener("load", function () {
        //update the preview tags source to display the image.
        preview.src = reader.result;
        field.value = reader.result;
    }, false);

    // read the file in the correct format.
    if (file) {
        reader.readAsDataURL(file);
    }
}

/**
 * Checks whether the users device is Web RTC compatible
 * @returns {boolean} The devices compatibility
 */
function checkCompatibility(){
    return !!(navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia ||
        navigator.msGetUserMedia);
}

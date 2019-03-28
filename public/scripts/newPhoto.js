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
        };
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
                document.getElementById('imageUrl').value = canvas.toDataURL();
                if (document.getElementById('added')!=null)
                    document.getElementById('added').style.display='block';
                $('#photo').modal('toggle');
            }
        }
    } else {
        if (document.getElementById('noSupport')!=null)
            document.getElementById('noSupport').style.display='block';
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
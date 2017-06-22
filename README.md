wcjs-player module commented out 1195 and 1197 lines in index.js file after npm install
For displaying the stream names on the cameras

## Installation
 
 `$ git clone git@gitlab.mw.metropolia.fi:sohjoa/elemulticamera.git`   
 `$ npm install`  
 Current setup is for windows x64 systems.  
 Note that for different platform the wcjs-prebuilt settings need to be adjusted in package json file.  
 Not all of the electron versions are compatible with wcjs. For full details:  
- https://github.com/Ivshti/wcjs-prebuilt
- https://github.com/RSATom/WebChimera.js/releases

## Gstreamer
   Gstream has not been implemented in electron application.  
   *To view the gstream console command:  
   `gst-launch-1.0 -e -v udpsrc port=5000 ! application/x-rtp, payload=96 ! rtpjitterbuffer ! rtph264depay ! avdec_h264 ! fpsdisplaysink sync=false text-overlay=false`
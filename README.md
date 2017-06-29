# Electron stream viewer
## Installation
 
 `$ git clone git@gitlab.mw.metropolia.fi:sohjoa/elemulticamera.git`  
  In the project directory  
 `$ npm install`  
  Create wowza.json with default configuration. (The default configuration can be removed, if so code needs to be 
  altered in the main.js file). This would mean that user has to enter everything and if option save login details is 
  selected (in the application), then the config is saved in the user data (separate from json).
 
 Current setup is for windows x64 systems.  
 Note that for different platform the wcjs-prebuilt settings need to be adjusted in package json file.  
 Not all of the electron versions are compatible with wcjs. For full details:  
- https://github.com/Ivshti/wcjs-prebuilt
- https://github.com/RSATom/WebChimera.js/releases

Current setup:  
wcjs - 0.2.7  
electron - 1.4.3  

## Description
Electron (Nodejs) desktop application for viewing wowza video streams. 
This is basically a client to view any rtsp wowza video streams in form of 2x2, 3x3 and 4x4 screens.

## Improvements
- Remove player automatically as the rtsp end shuts down.
- Password is not stored. If password management is to be implemented, OS specific method should be investigated.
- Application is not able to present rtp video stream which originates from gstreamer application. 
This can be done in several ways. One is native nodejs library, which uses gstreamer, either wcjs-gs for mac or make 
your own or use vlc (wcjs-player) to display the rtp stream. Note that so far experiments with vlc yielded only increased latency.
- Displaying several streams on one screen affects the appplication performance. Moreover there are some issues with removing the players.
4x4 is extreme size and might affect the quality of the streams. RAM and processor are the components that need to be improved 
if computer power is of concern. Better approach would be to combine video streams on wowza streaming server and then deliver 
the combined video stream to the client.
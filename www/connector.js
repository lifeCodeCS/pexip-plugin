var rtc;
var bandwidth;
var pin;
var video;
var conference;
var node;
var permissions;
var flash;
var presentation = null;
var flash_button = null;
var presWidth = 1280;
var presHeight = 720;
var presenter;
var source = null;
var presenting = false;
var startTime = null;
var userResized = false;
var presentationURL = '';
var videoPresentation = true;

function initalize(){
    var pexrtc_script = document.createElement('script');
		pexrtc_script.type = 'text/javascript';
		pexrtc_script.src = 'pexrtc.js';
		
		pexrtc_script.onload = function() {
			rtc = new PexRTC();
			console.log('RTC is ', rtc);
			video = document.getElementById('video');

			document.addEventListener('beforeunload', finalise);

			rtc.onSetup = doneSetup;
			console.log('doneSetup is a:', doneSetup);
			rtc.onConnect = connected;
			rtc.onError = remoteDisconnect;
			rtc.onDisconnect = remoteDisconnect;
			rtc.onParticipantCreate = participantCreate;
			rtc.onParticipantDelete = participantDelete;    
		};
}

function connect(){
    console.log('Connecting....');
		conference = document.getElementById('uriField').value.split('@')[0];
		node =  document.getElementById('uriField').value.split('@')[1];
		pin =  document.getElementById('userPin').value;
		rtc.makeCall(node, conference, pin, bandwidth);
		// don't refresh the page here
		alert('con');
		return false;
}

function error() {
  console.warn('Camera permission is not turned on');
}
 
function success( status ) {
	alert('suss');
  if( !status.hasPermission ) error();
}

function doneSetup(videoURL, pin_status) {
	console.log('doneSetup with pin_status and pin: ', pin_status, pin);
	document.getElementById('selfView').src = videoURL;
	rtc.connect(pin);
}

function connected(videoURL) {
	alert('connected');
	video.poster = "";
	video.src = videoURL
}

function muteAudio(){
	if(rtc.muteAudio())
		document.getElementById("btnMuteAudio").innerHTML = "UN-Mute";
	else
		document.getElementById("btnMuteAudio").innerHTML = "Mute Audio";
}

function remoteDisconnect() {
	console.log('remote disconnect');
}

function finalise() {
	console.log('finalise');
	rtc.disconnect();
	video.src = "";
}

function error() {
  console.log('Missing permissions');
}

function success( status ) {
  if( !status.hasPermission ) error();
}

function participantCreate(participant) {
	console.log('participant created: ', participant);
	var newParticipant = document.createElement('li')
	newParticipant.id = participant.uuid;
	newParticipant.appendChild(document.createTextNode(participant.display_name));
	document.getElementById('rosterList').appendChild(newParticipant);
}

function participantDelete(participant) {
	console.log('participant deleted: ', participant);
	var toRemove = document.getElementById(participant.uuid);
	document.getElementById('rosterList').removeChild(toRemove);
}

function sendMessage(message){
	rtc.sendChatMessage(message);
}

function messageRecived(message){
	document.getElementById('reciveMessage').value = message;
}

function presentationClosed() {
    id_presentation.textContent = trans['BUTTON_SHOWPRES'];
    if (presentation && presentation.document.getElementById('presvideo')) {
        rtc.stopPresentation();
    }
    presentation = null;
}

function remotePresentationClosed(reason) {
    if (presentation) {
        if (reason) {
            alert(reason);
        }
        presentation.close()
    }
}

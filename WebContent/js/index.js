var speak = 0;
var record = 0;
var inp = "";
var baseUrl = "https://api.api.ai/v1/";
var accessToken = "35b35640bfc745819840070409a7059b";
var reply = "";

var $messages = $('.messages-content'),
    d, h, m,
    i = 0;


function StartRecording() 
{
  if (record == 0) 
  {
    document.getElementById("micr").innerHTML = "Recording";
    record = 1;
    startAsr();
  }
  else
    if(record == 1)
    {
      record = 0;
      document.getElementById("micr").innerHTML = "Record";
    }
}


function StartSpeaking() 
{
  if(speak == 0)
  {
    speak = 1;
    tts();
    document.getElementById("spkr").src = "Resources/loud.png";
  }
  else
    if(speak == 1)
    {
      speak = 0;
      document.getElementById("spkr").src = "Resources/mute.png";
    }
}

function startAsr() 
{
  //Using Webkit SpeechRecognition API
  if (window.hasOwnProperty('webkitSpeechRecognition')) 
  {
      var recognition = new webkitSpeechRecognition();
 
    recognition.continuous = true;

    recognition.interimResults = false;
 
    recognition.lang = "en-US";
    recognition.start();
      
    //Displaying the result
    recognition.onresult = function(e) 
    {
        inp = e.results[0][0].transcript;
        document.getElementById('userinput').value = inp;
        stopRecognition(recognition);
    };
      
      recognition.onerror = function(e) 
      {
          recognition.stop();
    }
  }
}


function stopRecognition(recognition) 
{
  if (recognition) 
  {
    recognition.stop();
    recognition = null;
    msg = inp;
    record = 0;
    document.getElementById("micr").innerHTML = "Record";
    insertMessage();
    send();
  }
}

function send() 
{
  var text = inp;
  $.ajax(
  {
    type: "POST",
    url: baseUrl + "query?v=20150910",
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    headers: 
    {
      "Authorization": "Bearer " + accessToken
    },
    data: JSON.stringify({ q: text, lang: "en" }),
    success: function(data) 
    {
      //reply is being parsed
      reply = JSON.stringify(data['result']['fulfillment']['speech'], undefined, 2);
      systemMessage(reply);

      if (speak == 1) 
      {
        tts();
      }

    },
    error: function() 
    {
      setResponse("Internal Server Error");
    }
  });

  setResponse("Loading...");
    
}


$(window).load(function() 
{
  $messages.mCustomScrollbar();
  setTimeout(function() 
  {
  }, 100);
});


function updateScrollbar() {
  $messages.mCustomScrollbar("update").mCustomScrollbar('scrollTo', 'bottom', {
    scrollInertia: 10,
    timeout: 0
  });
}

function setDate(){
  d = new Date()
  if (m != d.getMinutes()) {
    m = d.getMinutes();
    $('<div class="timestamp">' + d.getHours() + ':' + m + '</div>').appendTo($('.message:last'));
  }
}


function insertMessage() 
{
  msg = $('.message-input').val();
  
  if ($.trim(msg) == '') {
    return false;
  }
  $('<div class="message message-personal">' + msg + '</div>').appendTo($('.mCSB_container')).addClass('new');
  setDate();
  $('.message-input').val(null);
  updateScrollbar();
}


$('.message-submit').click(function() {
  insertMessage();
});


$(window).on('keydown', function(e) 
{
  if (e.which == 13) 
  {
    event.preventDefault();
    inp = document.getElementById('userinput').value;
    insertMessage();
    send();
    return false;
  }
})


function systemMessage(text) 
{
  if ($('.message-input').val() != '') 
  {
    return false;
  }
  $('<div class="message new"><figure class="avatar"><img src="Resources/icon.png" /></figure>' + text + '</div>').appendTo($('.mCSB_container')).addClass('new');
  updateScrollbar();
}


function StartSpeaking() 
{
  if(speak == 0)
  {
    speak = 1;
    tts();
    document.getElementById("spkr").src = "../Resources/loud.png";
  }
  else
    if(speak == 1)
    {
      speak = 0;
      document.getElementById("spkr").src = "../Resources/mute.png";
    }
}


function switchRecognition() 
{
  if (recognition) 
  {
    stopRecognition();
  } 
  else 
  {
    startAsr();
  }
}

function setInput(text) 
{
  document.getElementById('userinput').value = text;
//  $("#userinput").val(text);
  send();
}
  
function updateRec() 
{
  $("#rec").text(recognition ? "Stop" : "Speak");
}
  
  

function tts()
{
   	var u = new SpeechSynthesisUtterance();
    var voices = window.speechSynthesis.getVoices();
    u.voice = voices[10]; // Note: some voices don't support altering params
    u.voiceURI = 'native';
    u.volume = 1; // 0 to 1
    u.rate = 1; // 0.1 to 10
    u.pitch = 2; //0 to 2
    u.text = reply;
    u.lang = 'en-US';
    u.rate = 1;
    speechSynthesis.speak(u);
}

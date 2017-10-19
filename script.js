//New timer is initialized
var timer = new Timer({
  onstart : function(){
              console.log('Stared')
            },
  onpause : function(){
              console.log('Paused')
            },
  ontick  : function(ms){
              app.startDisplayTime(ms);
            },
  onend   : function(){
              console.log("Stopped");
              app.stopDisplayTime();
            }
});


//Vue JS code targeting the component with id : app
var app = new Vue({
  //specify which element you are targeting
  el : '#app',
  //all the data your app needs
  data : {
    //this is what's getting displayed on the countdown timer
    minutes : "01",
    seconds : "00",
    //this is the real work or session time
    session_minutes : "01",
    session_seconds : "00",
    //this is the real break time
    break_minutes : "01",
    break_seconds : "00",
    //what is the current status of the app
    status : "Work",
    //encouraging text to be displayed. Changes depending on the status of the app
    whatToDo : "Make good use of it",
    //do the user wants to see more info about the pomodoro. Default false.
    showInfo : false,
    //BUG : suspected to be not used.
    show : true,

    //this determines what should be the rate in which progress-bar should progress.
    progressInAMinute : 10,
    progressInASecond : 10,
    multiplier : 1,

    //is it really break now ? At the start it's false.
    isBreak : false,

    //did the user press the increment or decrement time button ? Needed for resetting the progress-bar if needed.
    didWorkIncOrDec : true,
    didBreakIncOrDec : true

  },
  methods:{
    sessionInc : function(){
      //Fires when the user press the increment work/session minutes button

      //well don't do anything if the timer is already started.
      if(timer.getStatus() !== "started"){
        //first sync both minutes and session_minutes before changing, if they aren't the same.
        if(this.minutes !== this.session_minutes  && this.status === "Work"){
          this.minutes = this.session_minutes;
        }
        //Increment minutes
        this.session_minutes++;
        this.session_minutes = this.session_minutes < 10 ? "0"+this.session_minutes : this.session_minutes;
        this.session_seconds = "00";

        //only change the countdown-timer time if the status is work/session.
        if(this.status === "Work"){
          this.minutes++;
          this.minutes = this.minutes < 10 ? "0"+this.minutes : this.minutes;
          this.seconds = "00";
        }
        //well, it speaks for itself
        this.didWorkIncOrDec = true;
      }

    },
    sessionDec : function(){
      //Fires when the user press the decrement work/session minutes button

      //well don't do anything if the timer is already started.
      if(this.session_minutes > 1 && timer.getStatus() !== "started" ){
        //first sync both minutes and session_minutes before changing, if they aren't the same.
        if(this.minutes !== this.session_minutes  && this.status === "Work"){
          this.minutes = this.session_minutes;
        }
        //Decrement minutes
        this.session_minutes--;
        this.session_minutes = this.session_minutes < 10 ? "0"+this.session_minutes : this.session_minutes;
        this.session_seconds = "00";
        //only change the countdown-timer time if the status is work/session.
        if(this.status === "Work"){
          this.minutes--;
          this.minutes = this.minutes < 10 ? "0"+this.minutes : this.minutes;
          this.seconds = "00";
        }
        this.didWorkIncOrDec = true;
      }

    },
    //Increase and Decrease Break Length
    breakInc : function(){
      //Fires when the user press the Increment break minutes button

      //well don't do anything if the timer is already started.
      if(timer.getStatus() !== "started"){
        //first sync both minutes and break_minutes before changing, if they aren't the same.
        if(this.minutes !== this.break_minutes && this.status !== "Work" ){
          this.minutes = this.break_minutes;
        }
        //Increment minutes
        this.break_minutes++;
        this.break_minutes = this.break_minutes < 10 ? "0"+this.break_minutes : this.break_minutes;
        this.break_seconds = "00";
        //only change the countdown-timer time if the status is work/session.
        if(this.status !== "Work"){
          this.minutes++;
          this.minutes = this.minutes < 10 ? "0"+this.minutes : this.minutes;
          this.seconds = "00";
        }
        this.didBreakIncOrDec = true;
      }
    },
    breakDec : function(){
      //Fires when the user press the decrement break minutes button

      //well don't do anything if the timer is already started.
      if(this.break_minutes > 1 && timer.getStatus() !== "started"){
        //first sync both minutes and break_minutes before changing, if they aren't the same.
        if(this.minutes !== this.break_minutes  && this.status !== "Work"){
          this.minutes = this.break_minutes;
        }
        //Decrement minutes
        this.break_minutes--;
        this.break_minutes = this.break_minutes < 10 ? "0"+this.break_minutes : this.break_minutes;
        this.break_seconds = "00";
        //only change the countdown-timer time if the status is work/session.
        if(this.status !== "Work"){
          this.minutes--;
          this.minutes = this.minutes < 10 ? "0"+this.minutes : this.minutes;
          this.seconds = "00";
        }
        this.didBreakIncOrDec = true;
      }
    },

    startTimer : function(){
      //Starts the timer when the appropriate button is pressed.
      //This global variable is used to
      var x;
      var minutesForProgressBar;
      //code to run if the timer is started after the pause button is pressed.
      if(timer.getStatus() === "paused"){
        //the argument that timer.start() takes is the seconds the timer should run for.
        timer.start(this.seconds+(this.minutes*60));
        //if the pause button was pressed during the countdown , the minutes and session/break minutes wouldn't be in sync.
        //the countdown-timer minutes would be one less than the real session/break_minutes
        //so appropriately change the minutesForProgressBar variable.
        if(this.status === "Work" && this.minutes !== this.session_minutes)
          minutesForProgressBar = parseInt(this.minutes)+1;
        else if(this.status !== "Work" && this.minutes !== this.break_minutes)
          minutesForProgressBar = parseInt(this.minutes)+1;
        else minutesForProgressBar = parseInt(this.minutes);
      }
      //Well, if the start button is pressed without pressing the pause button.
      else{
        //check for the appropriate timer status
        if(this.status === "Work"){
          timer.start(this.session_minutes*60);
          minutesForProgressBar = this.session_minutes;
        }
        else {
          timer.start(this.break_minutes*60);
          minutesForProgressBar = this.break_minutes;
        }
      }
      //check whether there is really any Increment/decrement made. If so reset the progress bar.
      //Also would run if the timer is being started for the first time or is running without being altered any values.
      if( (this.status === "Work" && this.didWorkIncOrDec === true) || (this.status !== "Work" && this.didBreakIncOrDec === true) ){
        //what should be the progress of the bar in a minute ?
        this.progressInAMinute = 100/minutesForProgressBar;
        //what should be the progress of the bar in a second ?
        this.progressInASecond = this.progressInAMinute/60;
        //for every loop Increment this multiplier
        this.multiplier = 1;
        //start with 0% width for the var
        document.getElementById("progress").style.width = 0+"%";
        //change the variable truthiness because next time you don't want this be true in the middle of one cycle.
        if(this.status === "Work") this.didWorkIncOrDec = !this.didWorkIncOrDec;
        else this.didBreakIncOrDec = !this.didBreakIncOrDec;
      }
    },

    startDisplayTime : function(ms){
      //this function gets executed for every tick of the timer.
      //shows the remaining time on the screen.
      //the variable ms returns the remaining time in milliseconds
      var time = Math.round(ms/1000);
      var min = Math.floor(time/60);
      var sec = time%60;
      //changes the displayed remaining time
      this.minutes = min < 10 ? "0"+min : min;
      this.seconds = sec < 10 ? "0"+sec : sec;
      //changes the progress
      document.getElementById("progress").style.width = (this.progressInASecond*this.multiplier)+"%";
      this.multiplier++;
    },

    pauseTimer : function(){
      //pause the timer
      timer.pause();
    },

    stopDisplayTime : function(){
      //code to run when the timer comes to an end
      //BUG : A glitch(?) in display since timer stops at 00:01 instead of 00:00
      //fast fix. Note : Not the right way
      this.minutes = "00";
      this.seconds = "00";
      //BUG : Since the timer never reaches 00:00 the bar too never reaches full width. So manually doing it.
      //Still never gets filled properly.
      document.getElementById("progress").style.width = 100+"%";

      //Toggle between states
      if(this.status === "Work"){
        this.status = "Break";
        this.isBreak = true;
        //motivational text
        this.whatToDo = "You deserve it";
        //this should be set true because minutesForProgressBar and width of bar should be reset
        this.didBreakIncOrDec = true;
      }
      else{
        this.status = "Work";
        this.isBreak = false;
        this.whatToDo = "Make good use of it";
        this.didWorkIncOrDec = true;
      }

      //again start timer
      this.startTimer();
    }
  }
});

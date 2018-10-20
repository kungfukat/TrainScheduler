var config = {
    apiKey: "AIzaSyCREXp76zx0JNO9sZIGEe4N_1Didux4CKA",
    authDomain: "codersbay-21acc.firebaseapp.com",
    databaseURL: "https://codersbay-21acc.firebaseio.com",
    projectId: "codersbay-21acc",
    storageBucket: "codersbay-21acc.appspot.com",
    messagingSenderId: "931828519574"
};
firebase.initializeApp(config);
var database = firebase.database();
var trainName;
var destination;
var startTime;
var frequency;


$("#add-train").on("click", function (event) {
    console.log("clicked")
    event.preventDefault();

    trainName = $("#train-name").val().trim();
    destination = $("#destination").val().trim();
    startTime = moment($("#start-time").val().trim(), "hh:mm a").format("HH:mm");
    frequency = moment($("#frequency").val().trim()).format("mm");
    var newobj = {
        trainName: trainName,
        destination: destination,
        startTime: startTime,
        frequency: frequency
    };
    database.ref().push(newobj);
    console.log(newobj.trainName);
    console.log(newobj.destination);
    console.log(newobj.startTime);
    console.log(newobj.frequency);

    $("#train-name").val("")
    $("#destination").val("")
    $("#start-time").val("")
    $("#frequency").val("")
});

database.ref().on("child_added", function (childSnapshot) {
    var nameData = childSnapshot.val().trainName;
    var desData = childSnapshot.val().destination;
    var startData = childSnapshot.val().startTime;
    var freqData = childSnapshot.val().frequency;
    // getting the total amount of minutes since the start time to the current time
    var rest = moment().diff(moment(startData, "HH:mm"), "minutes");
    // dividing those minutes and the frequency gives you the amount of times the cycle has gone through *decimals are most likely to be received*
    var left = rest / freqData;
    // creating a new variable to store a whole number closest to the previous number *next cycle*
    var newLeft = Math.ceil(left);
    // the difference between those numbers gives you a decimal representing how much till the next cycle
    var diff = newLeft - left;
    // multiplying the frequency times that decimal gives you the amount of minutes left on the cycle, or the minutes left till the next train start time
    var til = freqData * diff;
    // a decimal is received in last step, this rounds the number in order to display a single digit format e.b "8 min"
    var minAway = Math.round(til);
    // adding those minutes to the current time to show when is the next train leaving the station
    var ew = moment().add(minAway, "minutes");
    // this console log shows the extact time and date shown in an object that was returned in the .add step
    console.log(ew._d);
    // apending info on table
    var newRow = $("<tr>").append(
        $("<td>").text(nameData),
        $("<td>").text(desData),
        $("<td>").text(freqData + " min"),
        $("<td>").text(ew._d),
        $("<td>").text(minAway + " min"),
      );
    
      // Append the new row to the table
      $("#train-table > tbody").append(newRow);


})


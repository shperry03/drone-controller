const fs = require('fs')
const dgram = require("dgram");
// const commandDelays = require("./commandDelays");
//goes from the backend(robot information) to the frontend (User Interface)
const app = require("express")();
const server = require("http").createServer(app);
const io = require("socket.io")(server);

const Port = 8889;
const StatePort = 8890;
const Host = "192.168.10.1";

/**
 * Set up buttons for application
 * 
 * ADD MORE BUTTONS FOR FUNCTIONALITY
 */
const upButton = document.getElementById('up-button')
const leftButton = document.getElementById('left-button')
const rightButton = document.getElementById('right-button')
const downButton = document.getElementById('down-button')

upButton.addEventListener('click', function(event){
    moveDrone("up")
})

leftButton.addEventListener('click', function(event){
    moveDrone("left")
})

rightButton.addEventListener('click', function(event){
    moveDrone("right")
})

downButton.addEventListener('click', function(event){
    moveDrone("down")
})

//backend: goes from robot to backend
// const drone = dgram.createSocket("udp4");
// drone.bind(Port);
// const droneState = dgram.createSocket("udp4");
// droneState.bind(StatePort);

let drone_takeoff = false;

const handleError = err => {
    if (err) {
      return "This is the error: ", err;
    }
};


// Default frequency and amplitude for sending to drone
const frequency = 3500;
let amplitude = 30;

function crtCMD(direction, distance) {
    return direction + " " + distance;
}
  
function command(direction, distance) {
    let cmd = crtCMD(direction, distance);
    drone.send(cmd, 0, cmd.length, Port, Host, handleError);
}

const start = () => {
    console.log("drone is taking off");
    drone_takeoff = true;
    drone.send("takeoff", 0, 8, Port, Host, handleError);
};

//MOVE THE DRONE 
function moveDrone(direction){
    console.log(direction)
    fs.appendFileSync('./data.txt',direction +  "\n")

    if (direction == "up") {
        command("up", amplitude);
    } else if (direction == "down"){
        command("down", amplitude);
    } else if (direction == "right"){
        command("right", amplitude);
    } else if (direction == "left"){
        command("left", amplitude);
    }
    
    if (drone_takeoff == false) {
        start();
    }
};

server.listen("6767", () => {
    console.log("up and running...");
});
  
drone.on("message", message => {
    console.log('${message}');
});
  
drone.send("command", 0, 8, Port, Host, handleError);

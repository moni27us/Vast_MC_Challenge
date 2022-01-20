// var tip = d3.tip()
//     .attr('class', 'd3-tip')
//     .offset([-10, 0])
//     .html(function (d) {
//         return "<strong>X:</strong> <span style='color:red'>" + d.x + "</span><br> <strong>Y:</strong> <span style='color:red'>" + d.y + "</span>";
//     })
import {updateDonutChart} from "./donutChart.js";

var marginTop = 10;
var proportion = 1 / 4;

var mapWidth = 4044;
var mapHeight = 4013;

var containerHeight = mapHeight * proportion + marginTop;
var containerWidth = mapWidth * proportion;

var squaresN = 100;
var squareWidth = containerWidth / squaresN;
var squareHeight = (containerHeight - marginTop) / squaresN;
let flag = false;

var xPosition = d3.scaleLinear()
    .domain([0, squaresN])
    .range([0, containerWidth]);

var yPosition = d3.scaleLinear()
    .domain([0, squaresN])
    .range([containerHeight - marginTop, 0]);


var svg = d3.select("#viz").append("svg").attr("width", containerWidth).attr("height", containerHeight);
// console.log(d3.select("#viz"))

var data = [];
for (var i = 0; i < squaresN; i++) {
    for (var j = 0; j < squaresN; j++) {
        data.push({x: i, y: j})
    }
}

// svg.call(tip);

svg.append("svg:image")
    .attr('x', 0)
    .attr('y', marginTop)
    .attr('height', containerHeight - marginTop)
    .attr('width', containerWidth)
    .attr("xlink:href", "Data/map.jpg")

// var selectedSquares = svg.append('text')
//   .attr('x', 0)
//   .attr('y', 30)
//   .attr('font-family', 'Helvetica')
//   .attr('font-size', '20px');

function run() {

    var squares = svg.selectAll('rect')
        .data(data)
        .enter()
    squares
        .append('rect')
        .attr('x', function (d) {
            return xPosition(d.x)
        })
        .attr('y', function (d) {
            return marginTop + yPosition(d.y) - squareHeight
        })
        .attr('width', squareWidth)
        .attr('height', squareHeight)
        .attr('stroke', 'black')
        .attr('stroke-width', 1)
        .attr('stroke-opacity', 0.0)
        .style('fill', d3.rgb(0, 0, 0))
        // .on('mouseover', tip.show)
        // .on('mouseout', tip.hide)
        .on('click', function (d, i) {
            addSelectedSquare(this, d)
        })
        .style('fill-opacity', 0);
}

function addSelectedSquare(obj, d) {
    d3.select(obj).style("fill-opacity", 0.0);
    document.getElementById('selected').innerHTML += '[' + d.x + ', ' + d.y + '], ';
}

let fri_movementData = {}
let sat_movementData = {}
let sun_movementData = {}
var checkins;
run();
var optGroup = document.createElement("optgroup")
d3.csv("./Data/group_identifier.csv", function(d) {
    var opt = document.createElement("option")
    opt.value = d['id']
    opt.innerText = "Group " + d['group']
    optGroup.append(opt)

}).then(function () {
    document.getElementById("groups").appendChild(optGroup)
})
d3.csv('./Data/fri.csv', function (d) {



        if (!(d["id"] in fri_movementData)) {
            fri_movementData[d["id"]] = []
        }
        fri_movementData[d["id"]].push({"x": d["X"], "y": d["Y"], "time": new Date(d["Timestamp"])})

}).then(function (processedData){
   d3.csv("./Data/sat.csv", function(d) {
       if (!(d["id"] in sat_movementData)) {
            sat_movementData[d["id"]] = []
        }
        sat_movementData[d["id"]].push({"x": d["X"], "y": d["Y"], "time": new Date(d["Timestamp"])})
   }).then(function(){
        d3.csv("./Data/sun.csv", function(d) {
       if (!(d["id"] in sun_movementData)) {
            sun_movementData[d["id"]] = []
        }
        sun_movementData[d["id"]].push({"x": d["X"], "y": d["Y"], "time": new Date(d["Timestamp"])})
   }).then(function(){
       // startAnimation("friday", "2012-01-01 08:00:00", "941906")
        })
   })
});

let rideCoordinate = []
d3.csv("./Data/ride_data.csv", function (d) {
    rideCoordinate.push([d['X'],d['Y'],d['ridename']])
}).then(function () {
    // console.log(rideCoordinate)
    draw_ride()
})

function draw_ride() {
    var rideCircle = svg.append('g').selectAll('rect')

    rideCircle.data(rideCoordinate)
        .enter()
        .append('circle')
        .attr("id", "0")
        .attr('class', 'cir')
        .attr('cx', function (d) {
            return xPosition(d[0])
        })
        .attr('cy', function (d) {
            return marginTop + yPosition(d[1]) - squareHeight
        })
        .attr("r","10")
        .attr('width', squareWidth)
        .attr('height', squareHeight)
        .style('fill', '#B6EB7A')
        .attr('stroke', 'black')
        .attr('stroke-width', 3)
        .style('fill-opacity', 1)
        .on("mouseover", function(){d3.select(this).style("fill", "orange");})
        .on("mouseout", function(){d3.select(this).style("fill", "#B6EB7A");})
        .on("click", function(d) { //trigger sruthi's chart if clicked
            console.log("clicked " + d[0] + "," + d[1] + "-" + d[2])
            $('#svgContent').empty();
            updateDonutChart(document.getElementById("days").value, d[2])
            
        })
}

export function startAnimation(day,time, id) {
    let sm = document.getElementById("map_error")
    sm.innerText = "";
    data = {}
    if(day == "friday") {
    data = fri_movementData
    } else if(day=="saturday") {
        data = sat_movementData
    } else {
        data = sun_movementData
    }
    time = new Date(time);
    console.log(time)
    if(data[id]) {
        timeFilter_animation(time, data[id]);
    } else {
        sm.innerText = "No Movement Data Available"
        flag= false
            document.getElementById("play").innerText = "Play"
            document.getElementById("days").disabled = false;
             document.getElementById("groups").disabled = false;
              document.getElementById("time").disabled = false;
    }
}

function runCheckins(data) {
    let mv = data
    var checkinSquares = svg.append('g').selectAll('rect')

    checkinSquares.data([mv[0]])
        .enter()
        .append('rect')
        .attr("id", "strt")
        .attr('x', function (d) {
            return xPosition(d.x)
        })
        .attr('y', function (d) {
            return marginTop + yPosition(d.y) - squareHeight
        })
        .attr('width', squareWidth)
        .attr('height', squareHeight)
        .style('fill', 'White')
        .attr('stroke', 'Green')
        .attr('stroke-width', 4)
        .style('fill-opacity', 0.9);
    let i = 1;
    setTimeout(function (){
         document.getElementById ("strt").remove()
    }, 500)
    // console.log(mv[0]['y'])
    let k = 0;
    let timeLoop = setInterval(function () {
        checkinSquares.data([mv[i]])
            .enter().append('rect')
            .attr("id", i + "")
            .attr('x', xPosition(mv[i].x))
            .attr('y', marginTop + yPosition(mv[i].y) - squareHeight)
            .attr('width', squareWidth)
            .attr('height', squareHeight)
            .style('fill', 'White')
            .attr('stroke', 'Green')
            .attr('stroke-width', 1)
            .style('fill-opacity', 0.9);
        let hour =  "" + mv[i]['time'].getHours()
        if(hour.length<2) {
            hour = "0" + hour
        }
        let min = "" +  "" + mv[i]['time'].getMinutes()
        if(min.length<2) {
            min = "0" + min;
        }
        document.getElementById("time").value = "" + hour + ":" + min
        // console.log(mv[i]['time'].getHours())
        i++
        setTimeout(function () {
            if(document.getElementById(k + ""))
            document.getElementById(k + "").remove()
            k++;
        }, 1000)
        if (i === mv.length || !flag) {
            flag= false
            document.getElementById("play").innerText = "Play"
            document.getElementById("days").disabled = false;
             document.getElementById("groups").disabled = false;
              document.getElementById("time").disabled = false;

            clearInterval(timeLoop)
        }

    }, 50)
    while(true) {
        if (document.getElementById(k + "")) {
            document.getElementById(k + "").remove()
            k++;
        } else {
            break;
        }

    }

}

function timeFilter_animation(startTime, data) {
    let d = []
    console.log(startTime.getMinutes())
    for (let item in data) {
        if ( (data[item]["time"].getMinutes()+data[item]["time"].getHours()*60)>= (startTime.getMinutes() + startTime.getHours()*60)) {
            d.push(data[item])
        }
        console.log("inside")
    }
    console.log(d)
    runCheckins(d)
}

console.log(document.getElementById("play"))
document.getElementById("play").addEventListener("click", function () {

    if( flag) {
        flag = false
        document.getElementById("play").innerHTML = "Play"
         document.getElementById("days").disabled = false;
             document.getElementById("groups").disabled = false;
              document.getElementById("time").disabled = false;

    } else {
        flag = true;
        document.getElementById("play").innerText = "Stop"
        let day = document.getElementById("days").value;
        let time = document.getElementById("time").value;
        document.getElementById("days").disabled = true;
             document.getElementById("groups").disabled = true;
              document.getElementById("time").disabled = true;
        let group = document.getElementById("groups").value;
        startAnimation(day,"2012-01-01 " + document.getElementById("time").value ,group);
    }
})
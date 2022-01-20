
var margin = {top: 10, right: 30, bottom: 90, left: 40},
width = 400 - margin.left - margin.right,
height = 400 - margin.top - margin.bottom;

var color = d3.scaleOrdinal(d3.schemeCategory10);  

document.addEventListener('DOMContentLoaded', function () {

svg = d3.select("#my_lollipopchart")
.append("svg")
.attr("width", width + margin.left + margin.right)
.attr("height", height + margin.top + margin.bottom)
.append("g")
.attr("transform",
      "translate(" + margin.left + "," + margin.top + ")");

Promise.all([d3.csv('data/dinomap.csv')])
    .then(function (values) {
        // console.log('loaded dino map');
        
        park_data = values[0];
        // console.log(park_data["Checkin"])
       
        park_data.forEach(fun => {
            fun.group = +fun["Col"]
            fun.Checkin = +fun["Checkin"]
            

        });
        
        drawLolliPopChart();
    });
});
function drawLolliPopChart() {
// console.log('trace:drawLollipopChart()');
svg.selectAll("*").remove(); 


var x = d3.scaleTime()
.range([ 0, width ])
.domain([0,50])

svg.append("g")
.attr("transform", "translate(0," + height + ")")
.call(d3.axisBottom(x).tickFormat(d3.format("d")))
.selectAll("text")
.attr("transform", "translate(-10,0)rotate(-45)")
.style("text-anchor", "end");

svg.append("text")             
   .attr("transform", "translate(" + (width/2) + " ," + (height + margin.top + 30) + ")")
   .style("text-anchor", "middle")
   .style("font-family","sans-serif")
   .style("font-size","14px")
   .style("font-weight","700")
   .text("Groups");

// Add Y axis
var y = d3.scaleLinear()
.domain([0,90])
.range([ height, 0]);
svg.append("g")
.call(d3.axisLeft(y));

svg.append("text")
   .attr("transform", "rotate(-90)")
   .attr("y", 0 - margin.left)
   .attr("x",0 - (height / 2))
   .attr("dy", "1em")
   .attr("font-family","sans-serif")
   .attr("font-size","14px")
   .attr("font-weight","700")
   .style("text-anchor", "middle")
   .text("Average Checkins"); 

svg.selectAll("myline")
.data(park_data)
.enter()
.append("line")
.attr("x1", function(d) { return x(d.group) })
.attr("x2", function(d) { return x(d.group) })
.attr("y1", function(d) {return y(d.Checkin);})
.attr("y2", y(0))
.attr("stroke", "green")


// Circles
svg.selectAll("mycircle")
.data(park_data)
.enter()
.append("circle")
.attr("cx", function(d) { return x(d.group); })
.attr("cy", function(d) { return y(d.Checkin);} )
.attr("r", "4")
.style("fill", "green")
.attr("stroke", "green")



}



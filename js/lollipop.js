let margin = {top: 10, right: 30, bottom: 90, left: 90},
    width = 1200 - margin.left - margin.right,
    height = 800 - margin.top - margin.bottom;

    let color = d3.scaleOrdinal(d3.schemeCategory10);
let svg = []
let park_data = []
document.addEventListener('DOMContentLoaded', function () {
    svg = d3.select("#lollipopchart")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g") 
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

   Promise.all([d3.csv('data/dinomap.csv')])
        .then(function (values) {
            console.log('loaded dino map');
            
             park_data = values[0];
            console.log(park_data)
           
            park_data.forEach(fun => {
                fun.group = +fun["Col"]
                fun.friday = +fun["friday"]
                fun.saturday = +fun["saturday"]
                fun.sunday = +fun["sunday"]
            });
            
            drawLolliPopChart();
        });
});
export function drawLolliPopChart() {
    console.log('trace:drawLollipopChart()');
    svg.selectAll("*").remove(); 
    var selectedvalue=document.getElementById("days").value;
        console.log(selectedvalue);

    var x = d3.scaleTime()
  .range([ 0, width ])
  .domain([0,150])
  
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
       .style("font-size","18px")
       .style("font-weight","700")
       .text("Groups");

if (selectedvalue=="friday"){
var y = d3.scaleLinear()
  .domain([0,350])
  .range([ height, 0]);
svg.append("g")
.transition()
     .duration(1000)
  .call(d3.axisLeft(y));
}else if (selectedvalue=="saturday"){
  var y = d3.scaleLinear()
  .domain([0,3500])
  .range([ height, 0]);
svg.append("g")
.transition()
     .duration(1000)
  .call(d3.axisLeft(y));
}else{
  var y = d3.scaleLinear()
  .domain([0,4500])
  .range([ height, 0]);
svg.append("g")
.transition()
     .duration(1000)
  .call(d3.axisLeft(y));
}

  svg.append("text")
       .attr("transform", "rotate(-90)")
       .attr("y", 0 - margin.left + 40)
       .attr("x",0 - (height / 2))
       .attr("dy", "0.1em")
       .attr("font-family","sans-serif")
       .attr("font-size","18px")
       .attr("font-weight","700")
       .style("text-anchor", "middle")
       .text("No. of Checkins");
 

       var curveFunc = d3.area()
  .x(function(d) { return x(d.group) })      // Position of both line breaks on the X axis
  .y1(function(d) { if (selectedvalue=="friday") {return y(d.friday);}else if (selectedvalue=="saturday") 
      {return y(d.saturday);}else if (selectedvalue=="sunday") {return y(d.sunday);} })     // Y position of top line breaks
  //.y0(5)                            // Y position of bottom line breaks (200 = bottom of svg area)

// Add the path using this helper function
svg.append('path')
  .attr('d', curveFunc(park_data))
  .attr('stroke', 'black')
  .attr('fill', '#BFA2DB');



  
  }




import {updateDonutChart} from "./donutChart.js";

// set the dimensions and margins of the graph
var margin = {top: 100, right: 15, bottom: 160, left: 60},
    width = 1160 - margin.left - margin.right,
    height = 1200 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#bar-chart")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

// svg.append("text")
//           .attr("x", width/2)
//           .attr("y", 0)
//           .attr("text-anchor", "middle")
//           .style("font-size", "16px")
//           .text("Bar Chart -");

// A function that create / update the plot for a given variable:
export function update_barchart(selectedVar) {
  svg.selectAll('*').remove();

  // Parse the Data
  // console.log("inside barchart")
  var csv = d3.csv("./Data/Checkin-Counts.csv")
 csv.then(function(data) {

  var x = d3.scaleBand()
          .range([ 0, width ])
          .padding(0.2);
var xAxis = svg.append("g")
  .attr("transform", "translate(0," + height + ")")

// Initialize the Y axis
var y = d3.scaleLinear()
  .range([ height, 0]);
var yAxis = svg.append("g")
  .attr("class", "myYaxis")

    // console.log(data)
    // X axis
    x.domain(data.map(function(d) { return d.ridename; }))
    xAxis.call(d3.axisBottom(x)).selectAll("text")
              .attr("y", 0)
              .attr("x", 9)
              .attr("dy", ".35em")
              .attr("transform", "rotate(90)")
              .style("text-anchor", "start");

    // Add Y axis
    y.domain([0, d3.max(data, function(d) { return +d[selectedVar] }) ]);
    yAxis.call(d3.axisLeft(y));

    // Add X axis label:
    svg.append("text")
        .attr("text-anchor", "end")
        .attr("x", width/2)
        .attr("y", height + margin.top + 110)
        .attr("font-size",12)
        .attr("font-weight", "bold")
        .text("Rides");

    // Y axis label:
    svg.append("text")
        .attr("text-anchor", "end")
        .attr("transform", "rotate(-90)")
        .attr("y", -margin.left+10)
        .attr("x", -margin.top-50)
        .attr("font-size",12)
        .attr("font-weight", "bold")
        .text("No. of Checkins")


    // variable u: map data to existing bars
    var u = svg.selectAll("rect")
               .data(data)

    // update bars
   let bar = u.enter()
              .append("rect")
              .attr("class", "bars")
              .attr("x", function(d) { return x(d.ridename); })
              .attr("y", function(d) { return y(+d[selectedVar]);})
              .attr("width", x.bandwidth())
              .attr("height", function(d) { return height - y(d[selectedVar]); })
              .attr("fill", function(d) { if(selectedVar== "friday")
                                            return "#68B0AB";
                                            else if(selectedVar=="saturday")
                                            return "#8FC0A9";
                                            else
                                            return "#E5707E";
                                          })
              .on("mouseover", function (d) {d3.select(this).style('opacity', 0.5);})
              .on("mouseout", function (d) {d3.select(this).style('opacity', 1);})
              .on("click", function(d){ console.log("clicked");updateDonutChart(selectedVar,d.ridename)});

  })
 
}

// Initialize plot
update_barchart('friday')
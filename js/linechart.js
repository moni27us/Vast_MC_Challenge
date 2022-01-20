const margin = {top: 50, right: 30, bottom: 90, left: 60};
const width = 1200 - margin.left - margin.right;
const height = 800 - margin.top - margin.bottom;
const startTime = d3.timeParse("%H:%M:%S")("08:00:00")
const endTime = d3.timeParse("%H:%M:%S")("23:59:59")
let ListGroups = [3, 73, 106, 133, 123]

var group_data
var parseTime = d3.timeParse("%H:%M");
const parseTime1 = d3.timeParse("%H:%M:%S")
var final_data1=[]
var final_data2=[]
var final_data3=[]
var final_data4=[]
var final_data5=[]

var x = 0
var previousid = 0
var temp = []
let svg = []
let fri_data = []
let sat_data = []
let sun_data = []
// This function is called once the HTML page is fully loaded by the browser
document.addEventListener('DOMContentLoaded', function () {
   // Hint: create or set your svg element inside this function
        svg = d3.select("#linechart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",`translate(${margin.left},${margin.top})`);

   // This will load your two CSV files and store them into two arrays.
   Promise.all([d3.csv('data/fri_group.csv'),
                d3.csv('data/sat_group.csv'),
                d3.csv('data/sun_group.csv')
                ])
        .then(function (values) {
            fri_data = values[0]
            sat_data = values[1]
            sun_data = values[2]
            // console.log("jeree")
            drawLineChart(2, 'friday',ListGroups);
        });

});

// Use this function to draw the lollipop chart.
export function drawLineChart(id, day, ListGroups) {
    // console.log('trace:drawLineChart()');

     //clear the svg when the drop-down value changes
     svg.selectAll("*").remove();

    // //get the dropdown value
    day = document.getElementById("days").value //To be removed

    let test = []
    let temp = []
    let final_data1 = []
    let final_data2=[]
    let final_data3=[]
    let final_data4=[]
    let final_data5=[]

    if(day == 'friday')
    {
        test = fri_data
        ListGroups = [3, 35, 85, 91, 98]   //To be removed
    }
    else if(day == 'saturday')
    {
        test = sat_data
        ListGroups = [15, 33, 47, 59, 146]   //To be removed
    }
    else if(day == 'sunday')
    {
        test = sun_data
        ListGroups = [25, 47, 73, 111, 145]   //To be removed
    }

    for(var i=0; i<test.length; i++)
    {
      let   currentid = Number(test[i].Group)

        if(currentid == ListGroups[0])
        {
            final_data1.push({'timestamp': parseTime1(test[i].Time), 'count':Number(test[i].Count), 'group':Number(test[i].Group)})
        }

        if(currentid == ListGroups[1])
        {
            final_data2.push({'timestamp': parseTime1(test[i].Time), 'count':Number(test[i].Count),'group':Number(test[i].Group)})
        }

        if(currentid == ListGroups[2])
        {
            final_data3.push({'timestamp': parseTime1(test[i].Time), 'count':Number(test[i].Count),'group':Number(test[i].Group)})
        }

        if(currentid == ListGroups[3])
        {
            final_data4.push({'timestamp': parseTime1(test[i].Time), 'count':Number(test[i].Count), 'group':Number(test[i].Group)})
        }

        if(currentid == ListGroups[4])
        {
            final_data5.push({'timestamp': parseTime1(test[i].Time), 'count':Number(test[i].Count), 'group':Number(test[i].Group)})
        }

    }

   let  mintime = Math.min(d3.min(final_data1, function(d) {return d.timestamp}),
                        d3.min(final_data2, function(d) {return d.timestamp}),
                        d3.min(final_data3, function(d) {return d.timestamp}),
                        d3.min(final_data4, function(d) {return d.timestamp}),
                        d3.min(final_data5, function(d) {return d.timestamp})
                       )
    let maxtime = Math.max(d3.max(final_data1, function(d) {return d.timestamp}),
                        d3.max(final_data2, function(d) {return d.timestamp}),
                        d3.max(final_data3, function(d) {return d.timestamp}),
                        d3.max(final_data4, function(d) {return d.timestamp}),
                        d3.max(final_data5, function(d) {return d.timestamp})
                    )
    let maxcount = Math.max(d3.max(final_data1, function(d) {return d.count}),
                        d3.max(final_data2, function(d) {return d.count}),
                        d3.max(final_data3, function(d) {return d.count}),
                        d3.max(final_data4, function(d) {return d.count}),
                        d3.max(final_data5, function(d) {return d.count})
                        )

    var tooltip = d3.select("body")
    .append("div")
    .style("position", "absolute")
    .style("text-align","left")
    .style("padding","5px")
    .style("background","white")
    .style("border","1px solid black")
    .style("border-radius","8px")
    .style("pointer-events","none")
    .style("font-size","15px")
    .style("opacity","0")

    var x = d3.scaleTime()
  .domain([mintime, maxtime])
  .range([0, width])

    var xAxis = d3.axisBottom(x)
    .tickFormat(d3.timeFormat("%H:%M:%S"))
    .ticks(30);

    svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis)
    .selectAll("text")
    .attr("y", -5)
    .attr("x", 30)
    .attr("transform", "rotate(90)")

    var y = d3.scaleLinear().domain([0,maxcount]).range([height,0])

    svg.append("g")
    .style("font-size","11px")
    .call(d3.axisLeft(y).ticks(10));

    svg.append("text")
    .attr("transform", "translate(" + (width/2) + " ," + (height + (margin.top+20)) + ")")
    .style("font-family","sans-serif")
    .style("font-size","15px")
    .style("font-weight","550")
    .text("Time");

    //add label to y-axis
    svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x",0 - (height / 2))
    .attr("dy", "1em")
    .attr("font-family","sans-serif")
    .attr("font-size","15px")
    .attr("font-weight","550")
    .style("text-anchor", "middle")
    .text("Count of movements");

    svg.append("path")
    .datum(final_data1)
    .attr("fill", "none")
    .attr("stroke", "brown")
    .attr("stroke-width", 2)
    .attr("class", "line1")
    // .style("opacity",0.2)
    .attr("d", d3.line()
                .x(function(t) {return x(t.timestamp)})
                .y(function(t) {return y(t.count)})
                )
    .on('mouseover', function(d,i) {

        tooltip.transition().duration(50).style("opacity", 1);

        tooltip.html("Group "+ListGroups[0] )
                .style("left", (d3.event.pageX + 10) + "px")
                .style("top", (d3.event.pageY + 15) + "px");
        })
    .on('mousemove', function(d,i) {

        tooltip.html("Group "+ListGroups[0] )
                .style("left", (d3.event.pageX + 10) + "px")
                .style("top", (d3.event.pageY + 15) + "px");
        })
    .on('mouseout', function(d,i) {
        tooltip.transition().duration('50').style("opacity", 0);
        })


    svg.append("path")
    .datum(final_data2)
    .attr("fill", "none")
    .attr("stroke", "purple")
    .attr("stroke-width", 2)
    .attr("class", "line2")
    // .style("opacity",0.2)
    .attr("d", d3.line()
                .x(function(t) {return x(t.timestamp)})
                .y(function(t) {return y(t.count)})
                )
    .on('mouseover', function(d,i) {

        tooltip.transition().duration(50).style("opacity", 1);

        tooltip.html("Group "+ListGroups[1] )
                .style("left", (d3.event.pageX + 10) + "px")
                .style("top", (d3.event.pageY + 15) + "px");
        })
    .on('mousemove', function(d,i) {

        tooltip.html("Group "+ListGroups[1] )
                .style("left", (d3.event.pageX + 10) + "px")
                .style("top", (d3.event.pageY + 15) + "px");
        })
    .on('mouseout', function(d,i) {
        tooltip.transition().duration('50').style("opacity", 0);
        })

    svg.append("path")
    .datum(final_data3)
    .attr("fill", "none")
    .attr("stroke", "hotpink")
    .attr("stroke-width", 2)
    .attr('id', t => { return t.count})
    .attr("class", "line3")
    // .style("opacity",0.2)
    .attr("d", d3.line()
                .x(function(t) {return x(t.timestamp)})
                .y(function(t) {return y(t.count)})
                )
    .on('mouseover', function(t,i) {
        tooltip.transition().duration(50).style("opacity", 1);

        tooltip.html("Group "+ListGroups[2])
                .style("left", (d3.event.pageX + 10) + "px")
                .style("top", (d3.event.pageY + 15) + "px");
        })
    .on('mousemove', function(t,i) {

        tooltip.html("Group "+ListGroups[2])
                .style("left", (d3.event.pageX + 10) + "px")
                .style("top", (d3.event.pageY + 15) + "px");
        })
    .on('mouseout', function(d,i) {
        tooltip.transition().duration('50').style("opacity", 0);
        })


    svg.append("path")
    .datum(final_data4)
    .attr("fill", "none")
    .attr("stroke", "darkgreen")
    .attr("stroke-width", 2)
    .attr("class", "line4")
    // .style("opacity",0.2)
    .attr("d", d3.line()
                .x(function(t) {return x(t.timestamp)})
                .y(function(t) {return y(t.count)})
                )
    .on('mouseover', function(d,i) {

        tooltip.transition().duration(50).style("opacity", 1);

        tooltip.html("Group "+ListGroups[3] )
                .style("left", (d3.event.pageX + 10) + "px")
                .style("top", (d3.event.pageY + 15) + "px");
        })
    .on('mousemove', function(d,i) {

        tooltip.html("Group "+ListGroups[3] )
                .style("left", (d3.event.pageX + 10) + "px")
                .style("top", (d3.event.pageY + 15) + "px");
        })
    .on('mouseout', function(d,i) {
        tooltip.transition().duration('50').style("opacity", 0);
        })

    svg.append("path")
    .datum(final_data5)
    .attr("fill", "none")
    .attr("stroke", "orange")
    .attr("stroke-width", 2)
    .attr("class", "line5")
    // .style("opacity",0.2)
    .attr("d", d3.line()
                .x(function(t) {return x(t.timestamp)})
                .y(function(t) {return y(t.count)})
                )
    .on('mouseover', function(t,i) {

        tooltip.transition().duration(50).style("opacity", 1);

        tooltip.html("Group " + ListGroups[4])
                .style("left", (d3.event.pageX + 10) + "px")
                .style("top", (d3.event.pageY + 15) + "px");
        })
    .on('mousemove', function(t,i) {

        tooltip.html("Group " + ListGroups[4])
                .style("left", (d3.event.pageX + 10) + "px")
                .style("top", (d3.event.pageY + 15) + "px");
        })
    .on('mouseout', function(t,i) {
        tooltip.transition().duration('50').style("opacity", 0);
        })
    // .on('click', function(t,i){
    //     d3.select(this).classed("line5",false)
    //     d3.select(this).style("opacity",1)
    // })

    svg.selectAll("legend")
    .data(["group1", "group2","group3","group4","group5"])
    .enter()
    .append("rect")
    .attr("x", width - 95)
    .attr("y", function( d, i){ return (margin.top-45) + i * (20)})
    .attr("width", 17)
    .attr("height", 17)
    .style("fill", function( d){ 
        if(d == "group1")
            return "brown"
        else if(d == "group2")
            return "purple"
        else if(d == "group3")
            return "hotpink"
        else if(d == "group4")
            return "darkgreen"
        else 
            return "orange"
    })

 svg.selectAll("label")
    .data(ListGroups)
    .enter()
    .append("text")
    .attr("x", width - 70)
    .attr("y", function( d, i){ return (margin.top-45) + i * (23) + 10})
    .style("fill", function( d){ return "black" })
    .attr("font-family", "sans-serif")
    .attr("font-size", "13px")
    .text(function(d){ return "Group "+d})

}
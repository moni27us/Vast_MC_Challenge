import {update_barchart} from "./BarChart.js";
import {drawLolliPopChart} from "./lollipop.js"
import {drawLineChart} from "./linechart.js";
import {updateDonutChart} from "./donutChart.js";


document.getElementById("days").addEventListener("change", function () {
    console.log("inside change")
    update_barchart(document.getElementById("days").value)
    //Monisha , you need to add the transition function here that would update your lollipop chart
    drawLolliPopChart()
    drawLineChart();
    // document.getElementById("svgContent").empty();
    updateDonutChart(document.getElementById("days").value, 'Atmosfear')
})

document.getElementById("lollipop").addEventListener("click", function () {
    document.getElementById("lollipop").disabled = true;
    document.getElementById("line").disabled = false;
    document.getElementById("lollipopchart").style.display = 'block';
    document.getElementById("linechart").style.display = 'none';

})
document.getElementById("line").addEventListener("click", function () {
    document.getElementById("line").disabled = true;
    document.getElementById("lollipop").disabled = false;
    document.getElementById("linechart").style.display = 'block';
    document.getElementById("lollipopchart").style.display = 'none';

})



document.getElementById("groups").addEventListener("change", function () {
    console.log('we need to call map animation here once we decide on the groups, @Radhika')
})

﻿// Bar Chart

var margin = { top: 80, right: 80, bottom: 80, left: 80 },
    width = 600 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1);

var y0 = d3.scale.linear().domain([300, 1100]).range([height, 0]),
    y1 = d3.scale.linear().domain([20, 80]).range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

// create left yAxis
var yAxisLeft = d3.svg.axis().scale(y0).ticks(4).orient("left");
// create right yAxis
var yAxisRight = d3.svg.axis().scale(y1).ticks(6).orient("right");

var svg = d3.select("#statistics-graph").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("class", "graph")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


function drawGraph(data) {
    x.domain(data.map(function (d) { return d.month; }));
    y0.domain([0, d3.max(data, function (d) { return d.comments; })]);

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "y axis axisLeft")
        .attr("transform", "translate(0,0)")
        .call(yAxisLeft)
        .append("text")
        .attr("y", 6)
        .attr("dy", "-2em")
        .style("text-anchor", "end")
        .style("text-anchor", "end")
        .text("Comments");

    bars = svg.selectAll(".bar").data(data).enter();

    bars.append("rect")
        .attr("class", "bar1")
        .attr("x", function (d) { return x(d.month) + x.rangeBand() / 4; })
        .attr("width", x.rangeBand() / 2)
        .attr("y", function (d) { return y0(d.comments); })
        .attr("height", function (d, i, j) { return height - y0(d.comments); });
}

$.getJSON("/Statistics/Comments", null, function (data) {
    drawGraph(data);
});


// Pie Chart

function drawPieChart(data) {
    var w = 450, //width
        h = 450, //height
        r = 180; //radius

    var vis = d3.select("#pie-chart")
        .append("svg:svg")              //create the SVG element inside the <body>
        .data([data])                   //associate our data with the document
        .attr("width", w)           //set the width and height of our visualization
        .attr("height", h)
        .append("svg:g")                //make a group to hold our pie chart
        .attr("transform", "translate(" + r + "," + r + ")")    //move the center of the pie chart

    var arc = d3.svg.arc()              //create path elements 
        .outerRadius(r);

    var pie = d3.layout.pie()           //create arc data 
        .value(function (d) { return d.value; });    //access the value of each element in our data array

    var arcs = vis.selectAll("g.slice")     //selects all elements with class slice
        .data(pie)                          //associate the generated pie data
        .enter()                            //create elements for every "extra" data element that should be associated with a selection.
        .append("svg:g")                //create a group to hold each slice

        .attr("class", "slice");    //allow us to style things in the slices

    arcs.append("svg:path")
        .attr("fill", function (d, i) { return d.data.color; }) //set the color for each slice to be chosen from the color function defined above
        .attr("d", arc);                                    //creates the actual SVG path using the associated data with the arc drawing function
     
    arcs.append("svg:text")                                     //add label to each slice
        .attr("transform", function (d) {                    //set label's origin 
            //make sure to set these before calling arc.centroid
            d.innerRadius = r / 4;
            d.outerRadius = r;
            return "translate(" + arc.centroid(d) + ")";        //this gives us a pair of coordinates like [50, 50]
        })
        .attr("text-anchor", "middle")                          //center the text on it's origin
        .text(function (d, i) { return data[i].label; });        //get the label from our original data array

}

$.getJSON("/Statistics/Items", null, function (data) {
    drawPieChart(data);
});
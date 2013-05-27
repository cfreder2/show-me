function monthlySales() {
//Examples: http://www.jeromecukier.net/stuff/data%20example/data-example4.html
//and: http://bl.ocks.org/mbostock/3883245
var width = 500,
    height = 500, 
    margin = 50;

var cwidth=300,cheight=100,cmargin=5,maxr=5;

var parseDate = d3.time.format("%Y%m%d").parse;

var x = d3.time.scale()
    .range([0, cwidth]);

var y = d3.scale.linear()
    .range([cheight, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var line = d3.svg.line()
    .x(function(d) { return x(d.key); })
    .y(function(d) { return y(d.values.Value); });

var svg=d3.select("body").append("svg");
///////////////////////////////////////////////////////

//setup scales:
var x=d3.time.scale().domain([0,5]).range([cmargin,cwidth-margin]);
var y=d3.scale.linear().domain([-10,10]).range([cheight-cmargin,cmargin]);

d3.csv("data/datafile.csv",function(csv) {

//Filter Sales measures
csv = csv.filter(function (d) {return d.Measure === "Sales"});

//While data is still flat, parse dates
csv.forEach(function(d) {d.Day = parseDate(d.Day);});

//Nest data for monthly sales charts
var data=d3.nest()
    .key(function(d) {return d.Region;})
    .key(function(d) {return d.Category;})
    .key(function(d) {return d.Day;})
    .sortKeys(d3.ascending)
    .rollup(function(d) {return {Value:d3.sum(d,function(g) {return +g.Value;})};})
    .entries(csv);

console.log(data);


// One cell for each region
var g=svg.selectAll("g").data(data).enter()
    .append("g")
    .attr("transform",function(d,i) {return "translate(0,"+(cheight*i)+")";});
g
    .append("rect")
    .attr("x",cmargin)
    .attr("y",cmargin)
    .attr("width",cwidth-2*cmargin)
    .attr("height",cheight-2*cmargin)
    .append("title")
    .text(function(d) {return d.key;})

// we also write its name below.
g
    .append("text")
    .attr("y",cheight+10)
    .attr("x",cmargin)
    .text(function(d) {return d.key;})

// create subgroups for the categories
g
    .selectAll("g")
    // we are getting the values of the categories like this:
    .data(function(d) {return d.values}) 
    .enter()
    .append("g")
    .attr("class",function(d) {return d.key;})

//TODO -> figure out why the &%@#$ it does not work when the variable g is added... Perhaps I'm too tired, heck this feels like talking to my self. Is'nt that the first sign of going mental?
    .selectAll("rect")
    .data(function(d) {return d.values})
    .enter()
    .append("rect")
    .attr("y", 0)
    .attr("x", function (d,i) {return i*25})
    .attr("width", 20)
    .attr("height", function(d) {return d.values.Value / 3})
    .attr("class", function(d) {return d.key;});

})
}


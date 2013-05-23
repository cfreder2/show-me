function monthlySales() {
//Examples: http://www.jeromecukier.net/stuff/data%20example/data-example4.html
//and: http://bl.ocks.org/mbostock/3883245
var width = 500,
    height = 500, 
    margin = 50;

var cwidth=100,cheight=100,cmargin=5,maxr=5;

var svg=d3.select("body").append("svg");
var x=d3.scale.linear().domain([0,5]).range([cmargin,cwidth-margin]);
var y=d3.scale.linear().domain([-10,10]).range([cheight-cmargin,cmargin]);

d3.csv("data/datafile.csv",function(csv) {

csv = csv.filter(function (el) {
  return el.Measure === "Sales"});
console.log(csv);

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

   
})

}


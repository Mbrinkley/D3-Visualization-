// Define SVG attributes
var width = parseInt(d3.select('#scatter')
    .style("width"));

var height = width * 2/3;
var margin = 10;
var labelArea = 110;
var padding = 45;

// Create SVG object 
var svg = d3.select("#scatter")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("class", "chart");

// Labels for x and y axis

svg.append("g").attr("class", "xText");
var xText = d3.select(".xText");

// Transform to adjust for xText
var bottomTextX =  (width - labelArea)/2 + labelArea;
var bottomTextY = height - margin - padding;
xText.attr("transform",`translate(
    ${bottomTextX}, 
    ${bottomTextY})`
    );

// x-axis
xText.append("text")
    .attr("y", 0)
    .attr("data-name", "age")
    .attr("data-axis", "x")
    .text("Age (Median)");

// y-axis 

svg.append("g").attr("class", "yText");
var yText = d3.select(".yText");

// Transform to adjust for yText
var leftTextX =  margin + padding;
var leftTextY = (height + labelArea) / 2 - labelArea;
yText.attr("transform",`translate(
    ${leftTextX}, 
     ${leftTextY}
    )rotate(-90)`
    );

yText .append("text")
    .attr("y", 0)
    .attr("data-name", "smokes")
    .attr("data-axis", "y")
    .text("Smokes (%)");

    
// Visualize data
var cRadius;
function adjustRadius() {
  if (width <= 530) {
    cRadius = 7;}
  else { 
    cRadius = 10;}
}
adjustRadius();

// Read data -using D3.csv
d3.csv("data/data.csv").then(function(data) {
    visualize(data);
});
function visualize (csvData) {
  var xMin;
  var xMax;
  var yMin;
  var yMax;

  // Current X & Y default selections
  var currentX = "smokes";
  var currentY = "age";

  

   // Find the data max & min values for scaling
   function xMinMax() {
     xMin = d3.min(csvData, function(d) {
       return parseFloat(d[currentX]) * 0.85;
     });
     xMax = d3.max(csvData, function(d) {
       return parseFloat(d[currentX]) * 1.15;
     });     
   }

   function yMinMax() {
     yMin = d3.min(csvData, function(d) {
       return parseFloat(d[currentY]) * 0.85;
     });
     yMax = d3.max(csvData, function(d) {
       return parseFloat(d[currentY]) * 1.15;
     }); 
   }

   // Scatter plot X & Y axis computation
   xMinMax();
   yMinMax();

   var xScale = d3 
       .scaleLinear()
       .domain([xMin, xMax])
       .range([margin + labelArea, width - margin])

   var yScale = d3
       .scaleLinear()
       .domain([yMin, yMax])
       .range([height - margin - labelArea, margin])

   // Create scaled X and Y axis
   var xAxis = d3.axisBottom(xScale);
   var yAxis = d3.axisLeft(yScale);

   // Calculate X and Y tick counts
   function tickCount() {
     if (width <= 530) {
        xAxis.ticks(5);
        yAxis.ticks(5);
     }
     else {
         xAxis.ticks(10);
         yAxis.ticks(10);
     }        
   }
   tickCount();

   // append x and y axis
   svg.append("g")
       .call(xAxis)
       .attr("class", "xAxis")
       .attr("transform", `translate(
           0, 
           ${height - margin - labelArea})`
       );

   svg.append("g")
       .call(yAxis)
       .attr("class", "yAxis")
       .attr("transform", `translate(
           ${margin + labelArea}, 
           0 )`
       );

   // Append the circles for each row of data
   var allCircles = svg.selectAll("g allCircles").data(csvData).enter();

   allCircles.append("circle")
       .attr("cx", function(d) {
           // xScale figures the pixels
           return xScale(d[currentX]);
       })
       .attr("cy", function(d) {
           return yScale(d[currentY]);
       })
       .attr("r", cRadius)
       .attr("class", function(d) {
           return "stateCircle " + d.abbr;
       })
       .on("mouseover", function(d) {
           // Show tooltip when mouse is on circle
           toolTip.show(d, this);
           // Highlight circle border
           d3.select(this).style("stroke", "#323232");
       })
       .on("mouseout", function (d) {
           // Remove the tooltip
           toolTip.hide(d);
           // Remove the highlight
           d3.select(this).style("stroke", "#e3e3e3")
       });

       // add State abbr. to circles 
       allCircles
           .append("text")
           .attr("font-size", cRadius)
           .attr("class", "stateText")
           .attr("dx", function(d) {
              return xScale(d[currentX]);
           })
           .attr("dy", function(d) {
             return yScale(d[currentY]) + cRadius /3;
           })
           .text(function(d) {
               return d.abbr;
             })

           .on("mouseover", function(d) {
               toolTip.show(d);
               d3.select("." + d.abbr).style("stroke", "#323232");
           })

           .on("mouseout", function(d) {
               toolTip.hide(d);
               d3.select("." + d.abbr).style("stroke", "#e3e3e3");
           });
}

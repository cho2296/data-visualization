
var dateParser = d3.timeParse("%m/%d/%Y");
var margin = {top: 40, right: 20, bottom: 80, left: 60};
var width = 400 - margin.left - margin.right;
var height = 460 - margin.top - margin.bottom;

var x = d3.scaleBand()
    .range([0, width])
    .padding(0.1);
var y = d3.scaleLinear()
    .range([height, 0]);

var svg = d3.select("#bar").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var circleColors = {'2020': "#6929c4", '2021': "#ff7c43", '2022': "#1192e8"};
var circleOpacity = {'2020': 0.6, '2021': 0.4, '2022': 0.2};
var circleR = {'2020': 2, '2021': 3, '2022': 5};

d3.csv("https://raw.githubusercontent.com/fuyuGT/CS7450-data/main/atl_weather_20to22.csv").then(
    function(maindata) {
        var data = Array.from(d3.rollup(maindata, v => d3.sum(v, d => d["Precip"]), d => d3.timeFormat("%Y")(dateParser(d.Date))));
        var weatherGroup = d3.groups(maindata, d=>d.Weather, d => d3.timeFormat("%Y")(dateParser(d.Date)));
        var rainCount = {"2020": weatherGroup[1][1][0][1].length, "2021": weatherGroup[1][1][1][1].length, "2022": weatherGroup[1][1][2][1].length};
        var drizzleCount = {"2020": weatherGroup[2][1][0][1].length, "2021": weatherGroup[2][1][1][1].length, "2022": weatherGroup[2][1][2][1].length};
        
        x.domain(data.map(function(d) { 
            return d[0]; 
        }));
        y.domain([0, d3.max(data, function(d) {
            return d[1]+10; 
        })]);

        //tooltip
        var tooltip = d3.select("#bar").append("div")
                        .attr("class", "tooltip")
                        .style("opacity", 0);

        svg.selectAll(".bar")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { 
            return x(d[0]); 
        })
        .attr("width", x.bandwidth())
        .attr("y", function(d) { 
            return y(d[1])
        })
        .attr("height", function(d) {
            return height - y(d[1]); 
        })
        .on("mouseover", function(event, d) {
            d3.select(this).style("fill", "#d45087");
            d3.selectAll('.dot_'+d[0]).style("fill", "#d45087").style("opacity", 1).style("r", 3);
            tooltip
                .html("Total Days for<br>" + "Rain:" + rainCount[d[0]] + "<br>" + "Drizzle: " + drizzleCount[d[0]])
                .style("opacity", 1)
        })
        .on("mousemove", function(event) {
            tooltip
                .style("left", (event.pageX) + "px")
                .style("top", (event.pageY - 28) + "px");
                
        })
        .on("mouseleave", function(event, d) {
            d3.selectAll('.dot_'+d[0]).style("fill", circleColors[d[0]]).style("opacity", circleOpacity[d[0]]).style("r", circleR[d[0]]);
            d3.selectAll('.bar').style("fill", "steelblue");
            tooltip
                .style("opacity", 0)
        });

        svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("transform", "translate(-15,10)rotate(-90)")
        .style("text-anchor", "end")
        .style("font-size", 12);

        svg.append("g")
        .call(d3.axisLeft(y));

        svg.append("text")
            .attr("text-anchor", "end")
            .attr("x", width/2 + 35)
            .attr("y", height + margin.top + 30)
            .style("font-size", 13)
            .text("Date (year)");

        svg.append("text")
            .attr("text-anchor", "end")
            .attr("transform", "rotate(-90)")
            .attr("y", - margin.left + 25)
            .attr("x", - height/2+margin.top+10)
            .style("font-size", 13)
            .text("Total Percipition (mm)");

        svg.append("text")
            .attr("x", (width / 2))             
            .attr("y", 0 - (margin.top/2))
            .attr("text-anchor", "middle")  
            .style("font-weight", "bold") 
            .style("text-decoration", "underline")  
            .text("Atlanta (2020-2022): Total Precipitation");
    });

//ScatterPlot
margin2 = {top: 60, right: 20, bottom: 150, left: 80};
width2 = 600 - margin2.left - margin2.right;
height2 = 600 - margin2.top - margin2.bottom;

x2 = d3.scaleLinear()
    .domain([0,80])
    .range([0, width2]);
y2 = d3.scaleLinear()
    .domain([0,12])
    .range([height2, 0]);

var svg2 = d3.select("#scatter").append("svg")
    .attr("width", width2 + margin2.left + margin2.right)
    .attr("height", height2 + margin2.top + margin2.bottom)
    .append("g")
    .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");

var div = d3.select("#scatter").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

d3.csv("https://raw.githubusercontent.com/fuyuGT/CS7450-data/main/atl_weather_20to22.csv").then(
    function(maindata2) {
        var data2 = Array.from(d3.filter(maindata2, x=>x.Visibility<10));

        svg2.selectAll("dot")
        .data(data2)
        .enter()
        .append("circle")
        .attr("id", "dot") 
        .attr("class", function(d) {
            var temp = d3.timeFormat("%Y")(dateParser(d.Date));
            return "dot_"+temp;
        })
        .attr("cx", function(d) { 
            return x2(d['Dewpoint']); 
        })
        .attr("cy", function(d) { 
            return y2(d['Visibility']);
        })
        .style("fill", function(d){
            var temp = d3.timeFormat("%Y")(dateParser(d.Date));
            return circleColors[temp];
        })
        .attr("opacity", function(d){
            var temp = d3.timeFormat("%Y")(dateParser(d.Date));
            return circleOpacity[temp];
        })
        .attr("r", function(d){
            var temp = d3.timeFormat("%Y")(dateParser(d.Date));
            return circleR[temp];
        });

        svg2.append("g")
        .attr("transform", "translate(0," + height2 + ")")
        .call(d3.axisBottom(x2));

        svg2.append("g")
        .call(d3.axisLeft(y2));
        
        svg2.append("text")
            .attr("text-anchor", "end")
            .attr("x", margin2.left+width2/2 - 55)
            .attr("y", height2 + margin2.top - 10)
            .style("font-size", 13)
            .text("Dew Point");

        svg2.append("text")
            .attr("text-anchor", "end")
            .attr("transform", "rotate(-90)")
            .attr("y", - margin2.left/2)
            .attr("x", - margin2.top*2 - 55)
            .style("font-size", 13)
            .text("Visibility");

        svg2.append("text")
            .attr("x", width2/2)             
            .attr("y", - margin2.top/2)
            .attr("text-anchor", "middle")  
            .style("font-weight", "bold") 
            .style("text-decoration", "underline")  
            .text("Atlanta (2020-2022): Dew Point vs. Visibility");
    });


//Stacked Area Chart
var margin3 = {top: 40, right: 20, bottom: 80, left: 50};
var width3 = 900 - margin.left - margin.right;
var height3 = 400 - margin.top - margin.bottom;


d3.csv("https://raw.githubusercontent.com/fuyuGT/CS7450-data/main/atl_weather_20to22.csv").then(
    function(maindata3) {        
    var data3 = Array.from(maindata3.map(function(d){return {date: dateParser(d.Date), value:[d.TempMax, d.TempMin, d.Windspeed]}}));//max:d.TempMax, min:d.TempMin, wind:d.Windspeed} }));
    filteredData = d3.filter(data3, d=>d3.timeFormat("%Y")(d.date)==2022);

    var allGroup = ["2022", "2021", "2020"];
    d3.select("#ButtonOfChoice")
      .selectAll('options')
     	.data(allGroup)
      .enter()
    	.append('option')
      .text(function (d) { return d; })
      .attr("value", function (d) { return d; });

    var arrayofColor = ["#CD6155", "#85C1E9", "#82E0AA"];
    var xLabels = ["Maximum Temparature", "Minimum Temparature", "WindSpeed"]

    

    function update(data4){
        var svg3 = d3.select("#line").append("svg")
        .attr("width", width3 + margin3.left + margin3.right)
        .attr("height", height3 + margin3.top + margin3.bottom)
        .append("g")
        .attr("transform", "translate(" + margin3.left + "," + margin3.top + ")");

        var x3 = d3.scaleTime()
        .domain(d3.extent(data4, function(d) { return d.date; }))
        .range([ 0, width3 ]);

        svg3.append("g")
            .attr("transform", "translate(0," + height3 + ")")
            .call(d3.axisBottom(x3).ticks(d3.timeMonth.every(1)).tickFormat(d3.timeFormat("%b")));

        var y3 = d3.scaleLinear()
            .domain([0, 100])
            .range([ height3, 0 ]);
        svg3.append("g")
            .call(d3.axisLeft(y3));

        data4[0].value.forEach(function(value,i){
            svg3.append("path")
            .datum(data4)
            .attr("fill", arrayofColor[i])
            .attr("stroke", arrayofColor[i])
            .attr("stroke-width", 1.5)
            .attr("d", d3.area()//line()
                .x(function(d) { return x3(d.date) })
                .y0(y3(0))
                .y1(function(d) { return y3(d.value[i]) })
            );

            svg3.append("text")
            .attr("text-anchor", "end")
            .attr("x", margin3.left+width3/2 - 55)
            .attr("y", height3 + margin3.top)
            .style("font-size", 13)
            .text("Date (month)");
    
            svg3.append("text")
            .attr("text-anchor", "end")
            .attr("x",margin3.left*3+(i*300))
            .attr("y", height3 + margin3.top+35)
            .attr("fill", arrayofColor[i])
            .text(xLabels[i])
            });
    
            svg3.append("text")
            .attr("x", width3/2)             
            .attr("y", - margin3.top/2)
            .attr("text-anchor", "middle")  
            .style("font-weight", "bold") 
            .style("text-decoration", "underline")  
            .text("Atlanta (" +d3.timeFormat("%Y")(data4[0].date)+ "): Maximum and Minimum Temparature Along With Windspeed");
            
    }

    update(filteredData);
    d3.selectAll("#ButtonOfChoice").on("change", function(d){
        var selectedOption = d3.select(this).property("value");
        filteredData = d3.filter(data3, d=>d3.timeFormat("%Y")(d.date)==selectedOption);
        d3.select("#line").select("svg").remove();
        update(filteredData);
      })
    });

d3.select("#summary").style('visibility', 'hidden');

d3.select('#input-file').on('change', () => {
    readFiles(d3.select('#input-file').property('files'));
});

function str_pad_left(string,pad,length) {
    return (new Array(length+1).join(pad)+string).slice(-length);
}

function displayGraphs(data) {
    const paces = Array.from(data.paces.entries());
    const distances = Array.from(data.distances.entries());
    const strokeRates = Array.from(data.strokeRates.entries());
    const heartRates = Array.from(data.heartRates.entries());


    var svg = d3.select('#datas').append("svg").attr("width", 700).attr("height", 600),
        margin = { top: 20, right: 100, bottom: 30, left: 50 },
        width = +svg.attr("width") - margin.left - margin.right,
        height = +svg.attr("height") - margin.top - margin.bottom,
        g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    const singleGraphHeight = height / 4,
        graphMargin = 10;


    var x = d3.scaleTime()
        .rangeRound([0, width]);

    var yPace = d3.scaleLinear()
        .rangeRound([0, height - (3*singleGraphHeight - graphMargin)]);
    var yHeartRate = d3.scaleLinear()
        .rangeRound([height - (2*singleGraphHeight - graphMargin), height - (3*singleGraphHeight - 2*graphMargin)]);
    var yStrokeRate = d3.scaleLinear()
        .rangeRound([height - (singleGraphHeight - graphMargin), height - (2*singleGraphHeight - 2*graphMargin)]);
    var yDistance = d3.scaleLinear()
        .rangeRound([height, height - (singleGraphHeight - 2*graphMargin)]);
   

    var t = d3.transition()
        .duration(5000)
        .ease(d3.easeLinear);

    const max = d3.max([paces, strokeRates, distances, heartRates],
        (array) => d3.max(array.map((value) => value[0])));

    const min = d3.min([paces, strokeRates, distances, heartRates],
        (array) => d3.min(array.map((value) => value[0])));

    x.domain([min, max]);
    yPace.domain(d3.extent(paces, function (d) { return d[1]; }));
    yDistance.domain(d3.extent(distances, function (d) { return d[1]; }));
    yStrokeRate.domain(d3.extent(strokeRates, function (d) { return d[1]; }));
    yHeartRate.domain(d3.extent(heartRates, function (d) { return d[1]; }));


    var linePace = d3.line()
        .x(function (d) { return x(d[0]); })
        .y(function (d) { return yPace(d[1]); });

    var lineDistance = d3.line()
        .x(function (d) { return x(d[0]); })
        .y(function (d) { return yDistance(d[1]); });

    var lineStrokeRate = d3.line()
        .x(function (d) { return x(d[0]); })
        .y(function (d) { return yStrokeRate(d[1]); });

    var lineHearRate = d3.line()
        .x(function (d) { return x(d[0]); })
        .y(function (d) { return yHeartRate(d[1]); });

    g.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    g.append("g")
        .call(d3.axisLeft(yPace).ticks(5).tickFormat(function(d) {
            var minutes = Math.floor(d / 60);
            var seconds = d - minutes * 60;
            return str_pad_left(minutes,'0',2)+':'+str_pad_left(seconds,'0',2);
        }))
        .append("text")
        .attr("fill", "#000")
        .attr("transform", "rotate(-90)")
        .attr("x", 15)
        .attr("y", 6)
        .attr("dy", "0.71em")
        .attr("text-anchor", "end")
        .text("Pace (min/500m)");

    g.append("g")
        .call(d3.axisLeft(yHeartRate).ticks(5))
        .append("text")
        .attr("fill", "#000")
        .attr("transform", "rotate(-90)")
        .attr("x", - singleGraphHeight)
        .attr("y", 6)
        .attr("dy", "0.71em")
        .attr("text-anchor", "end")
        .text("Heart rate (bpm)");

      
    g.append("g")
        .call(d3.axisLeft(yStrokeRate).ticks(5))
        .append("text")
        .attr("fill", "#000")
        .attr("transform", "rotate(-90)")
        .attr("x", - 2*singleGraphHeight - 10)
        .attr("y", 6)
        .attr("dy", "0.71em")
        .attr("text-anchor", "end")
        .text("Stroke rate (str/min)");

    g.append("g")
        .call(d3.axisLeft(yDistance).ticks(5))
        .append("text")
        .attr("fill", "#000")
        .attr("transform", "rotate(-90)")
        .attr("x", - 3*singleGraphHeight - 10)
        .attr("y", 6)
        .attr("dy", "0.71em")
        .attr("text-anchor", "end")
        .text("Distance (m.)");

    g.append("path")
        .datum(paces)
        .attr("class", "line")
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("stroke-width", 1.5)
        .attr("d", linePace);


    g.append("path")
        .datum(heartRates)
        .attr("class", "line")
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("stroke-width", 1.5)
        .attr("d", lineHearRate);


    g.append("path")
        .datum(strokeRates)
        .attr("class", "line")
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("stroke-width", 1.5)
        .attr("d", lineStrokeRate);

    g.append("path")
        .datum(distances)
        .attr("class", "line")
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("stroke-width", 1.5)
        .attr("d", lineDistance);


    // Everything has been taken here https://bl.ocks.org/larsenmtl/e3b8b7c2ca4787f77d78f58d41c3da91
    let mouseG = svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .attr("class", "mouse-over-effects");

    mouseG.append("path") // this is the black vertical line to follow mouse
        .attr("class", "mouse-line")
        .style("stroke", "black")
        .style("stroke-width", "2px")
        .style("opacity", "0");

    let lines = document.getElementsByClassName('line');

    var mousePerLine = mouseG.selectAll('.mouse-per-line')
        .data(paces)
        .enter()
        .append("g")
        .attr("class", "mouse-per-line");

    mousePerLine.append("circle")
        .attr("r", 10)
        .style("stroke", "steelblue")
        .style("fill", "none")
        .style("stroke-width", "2px")
        .attr("transform", "translate(-100, 0)")
        .style("opacity", "0");

    mousePerLine.append("text")
        .attr("transform", "translate(10,3)");


    mouseG.append('svg:rect') // append a rect to catch mouse movements on canvas
        .attr('width', width) // can't catch mouse events on a g element
        .attr('height', height)
        .attr('fill', 'none')
        .attr('pointer-events', 'all')
        .on('mouseout', function () { // on mouse out hide line, circles and text
            d3.select(".mouse-line")
                .style("opacity", "0");
            d3.selectAll(".mouse-per-line circle")
                .style("opacity", "0");
            d3.selectAll(".mouse-per-line text")
                .style("opacity", "0");
        })
        .on('mouseover', function () { // on mouse in show line, circles and text
            d3.select(".mouse-line")
                .style("opacity", "1");
            d3.selectAll(".mouse-per-line circle")
                .style("opacity", "1");
            d3.selectAll(".mouse-per-line text")
                .style("opacity", "1");
        })
        .on('mousemove', function () { // mouse moving over canvas
            var mouse = d3.mouse(this);
            d3.select(".mouse-line")
                .attr("d", function () {
                    var d = "M" + mouse[0] + "," + height;
                    d += " " + mouse[0] + "," + 0;
                    return d;
                });

            d3.selectAll(".mouse-per-line")
                .attr("transform", function (d, i) {
                    if (i >= lines.length) {
                        return;
                    }

                    var beginning = 0,
                        end = lines[i].getTotalLength(),
                        target = null;

                    while (true) {
                        target = Math.floor((beginning + end) / 2);
                        pos = lines[i].getPointAtLength(target);
                        if ((target === end || target === beginning) && pos.x !== mouse[0]) {
                            break;
                        }
                        if (pos.x > mouse[0]) end = target;
                        else if (pos.x < mouse[0]) beginning = target;
                        else break; //position found
                    }

                    d3.select(this).select('text').attr("transform", "translate(-98, 25)")
                        .text((d) => {
                            if(i === 0) {
                                const time = Math.round(yPace.invert(pos.y));
                                var minutes = Math.floor(time / 60);
                                var seconds = time - minutes * 60;
                                return str_pad_left(minutes,'0',2)+':'+str_pad_left(seconds,'0',2) + '/500m';
                            } else if (i === 1) {
                                return Math.round(yHeartRate.invert(pos.y)) + ' bpm';
                            } else if (i === 2) {
                                return Math.round(yStrokeRate.invert(pos.y)) + ' str/min.';
                            } else {
                                return Math.round(yDistance.invert(pos.y)) + ' m.';
                            }
                        });

                    return "translate(" + (mouse[0] + 100) + "," +pos.y + ")";
                });
        });
}



function displaySummary(summary) {
    d3.select("#summary").style('visibility', 'visible');
    d3.select("#start-time").text(() => summary.startTime.format('HH:mm:ss'));
    d3.select("#end-time").text(() => summary.endTime.format('HH:mm:ss'));
    d3.select("#duration").text(() => summary.duration.format('HH:mm:ss'));
    d3.select("#distance").text(() => summary.totalDistance.meters + ' m.');
    d3.select("#average-pace").text(() => {
        const time = summary.averagePace.seconds;
        var minutes = Math.floor(time / 60);
        var seconds = time - minutes * 60;
        return str_pad_left(minutes,'0',2)+':'+str_pad_left(seconds,'0',2) + '/500m';
        
    });
    d3.select("#average-stroke-rate").text(() => Math.round(summary.averageStrokeRate.value)  + ' str/min');
}

function display(datas) {
    displayGraphs(datas);
    displaySummary(datas.summary);
}

function endReadFiles(resultObject) {
    resultObject.summary.startTime = moment(resultObject.summary.startTime, 'HH:mm');
    resultObject.summary.endTime = moment(resultObject.summary.endTime, 'HH:mm');
    resultObject.summary.duration = moment.utc(resultObject.summary.endTime.diff(resultObject.summary.startTime));
    display(resultObject);
}

function readFiles(files) {
    const resultObject = {
        summary: {},
        paces: new Map(),
        distances: new Map(),
        strokeRates: new Map(),
        heartRates: new Map(),
    };
    let summaryRead = false,
        paceRead = false,
        strokeRateRead = false,
        heartRateRead = false,
        distanceRead = false;
    const totalFiles = files.length;

    const allFilesRead = () => {
        return summaryRead && strokeRateRead && distanceRead && paceRead && heartRateRead;
    }

    let finishedReader = 0;
    Array.from(files).forEach(file => {
        switch (file.name) {
            case 'Summary.txt':
                const summaryReader = new FileReader();
                summaryReader.onload = (e) => {
                    resultObject.summary = JSON.parse(e.target.result);
                    summaryRead = true;
                    if (allFilesRead()) {
                        return endReadFiles(resultObject);
                    }
                };
                summaryReader.readAsText(file)
                break;
            case 'Distance.txt':
                const distanceReader = new FileReader();
                distanceReader.onload = (e) => {
                    const lines = e.target.result.split('\n');
                    lines.forEach(line => {
                        const values = line.split(' ');
                        const timestamp = parseInt(values[0], 10);
                        resultObject.distances.set(timestamp, parseFloat(values[1]));
                    });
                    distanceRead = true;
                    if (allFilesRead()) {
                        return endReadFiles(resultObject);
                    }
                };
                distanceReader.readAsText(file)
                break;
            case 'Pace.txt':
                const paceReader = new FileReader();
                paceReader.onload = (e) => {
                    const lines = e.target.result.split('\n');
                    lines.forEach(line => {
                        const values = line.split(' ');
                        const timestamp = parseInt(values[0], 10);
                        resultObject.paces.set(timestamp, parseInt(values[1], 10));
                    });
                    paceRead = true;
                    if (allFilesRead()) {
                        return endReadFiles(resultObject);
                    }
                };
                paceReader.readAsText(file)
                break;
            case 'StrokeRate.txt':
                const strokeRateReader = new FileReader();
                strokeRateReader.onload = (e) => {
                    const lines = e.target.result.split('\n');
                    lines.forEach(line => {
                        const values = line.split(' ');
                        const timestamp = parseInt(values[0], 10);
                        resultObject.strokeRates.set(timestamp, parseFloat(values[1]));
                    });
                    strokeRateRead = true;
                    if (allFilesRead()) {
                        return endReadFiles(resultObject);
                    }
                };
                strokeRateReader.readAsText(file)
                break;
            case 'HeartRate.txt':
                const heartRateReader = new FileReader();
                heartRateReader.onload = (e) => {
                    const lines = e.target.result.split('\n');
                    lines.forEach(line => {
                        const values = line.split(' ');
                        const timestamp = parseInt(values[0], 10);
                        resultObject.heartRates.set(timestamp, parseFloat(values[1]));
                    });
                    heartRateRead = true;
                    if (allFilesRead()) {
                        return endReadFiles(resultObject);
                    }
                };
                heartRateReader.readAsText(file)
                break;
        }
    });
}

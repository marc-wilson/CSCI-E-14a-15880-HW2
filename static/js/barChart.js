// D3 Reference: https://bl.ocks.org/santiagogaray/e203193d9a8ba21be9a25b797880ac71



var data, txt, svg, x, y, bins, bar;
var formatCount = d3.format(",.0f");

d3.json("/load_data", function (error, json_data) {
    if (!error) {
        data = json_data['users'];
        const programmingLanguage = new URLSearchParams(window.location.search).get('prog_lang');
        if (programmingLanguage) {
            data = data.filter( d => d.prog_lang === programmingLanguage);
        }
        map = data.map(function (d, i) {
            return parseFloat(d.age);
        });
        createVis()
    }

    else {
        console.log("Data not loaded!!!")
    }

});

function createVis() {

    // visualize the total number of users
    // use txt variable defined above
    const txt = d3.select("#total_users_text")
        .append("text");

    // Part 1

    // ------ YOUR CODE GOES HERE --------

    // into .text attribute pass the lenghts of the data

    txt
        .selectAll('text')
        .data([data.length])
        .enter()
        .append('text')
        .text(d => d)
        .style("text-anchor", "start")
        .style("font-size", "30px")
        .style("font-style", "italic")
        .attr("fill", "#888")
        .attr("y", 440)
        .attr("x", 10);


    // Part 2

    // ------ YOUR CODE GOES HERE --------

    // a. Create x and y scale

    // b. Create bins and histogram

    // c. Create bars (rect)

    // d. Create bar labels

    // e. Call Axes

    // f. Create Axes label

    const svg = d3.select("#barChart");
    const margin = {top: 0, right: 45, bottom: 45, left: 0};
    const width = +svg.attr("width") - margin.left - margin.right;
    const height = +svg.attr("height") - margin.top - margin.bottom;
    const g = svg.append("g").attr('transform', `translate(${margin.left}, ${margin.top})`);

    const formatCount = d3.format(',.0f');

    const xScale = d3.scaleLinear()
        .rangeRound([0, width])
        .domain([d3.min(map), d3.max(map)]);

    const bins = d3.histogram()
        .domain(xScale.domain())
        .thresholds(xScale.ticks(13))
        (map);

    console.log('bins', bins);
    const yScale = d3.scaleLinear()
        .domain([0, d3.max(bins, d => d.length )])
        .range([height, 0]);

    const bar = g.selectAll('.bar')
        .data(bins)
        .enter()
        .append('g')
        .attr('class', 'bar')
        .attr('transform', d => `translate(${xScale(d.x0)}, ${yScale(d.length)})`);

    bar.append('rect')
        .attr('x', 0)
        .attr('width', xScale(bins[0].x1) - xScale(bins[0].x0))
        .attr('height', d => height - yScale(d.length))
        .style('fill', '#9b0a0a');

    bar.append('text')
        .attr('dy', '.75em')
        .attr('y', -15)
        .attr('x', (xScale(bins[0].x1) - xScale(bins[0].x0)) / 2)
        .attr('text-anchor', 'middle')
        .text( d => formatCount(d.length))
        .style('color', 'white');

    g.append('g')
        .attr('class', 'axis axis--x')
        .attr('transform', `translate(0, ${height})`)
        .call(d3.axisBottom(xScale).ticks(5));


}

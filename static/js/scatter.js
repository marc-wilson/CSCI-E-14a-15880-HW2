d3.json("/load_data", function (data) {

    data = data['users'];
    // Part 1

    // ------ YOUR CODE GOES HERE --------

    // Convert experience_yr, hw1_hrs and age into numerical values

    // This has already been done. Since our data is stored with the correct types in the db,
    // we can guarentee that the types given to us are correct given the back end code isn't
    // doing any type coercion.
    const programmingLanguage = new URLSearchParams(window.location.search).get('prog_lang');
    if (programmingLanguage) {
        data = data.filter(d => d.prog_lang === programmingLanguage);
    }
    data = data.map(d => {
        d.age = +d.age;
        d.experience_yr = Math.ceil(+d.experience_yr);
        d.hw1_hrs = Math.ceil(+d.hw1_hrs);
        return d;
    });


    var svg = d3.select("#scatter");

    margin = {top: 20, right: 10, bottom: 50, left: 20},
        width = +svg.attr("width") - margin.left - margin.right,
        height = +svg.attr("height") - margin.top - margin.bottom,
        g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    var radius = d3.scaleSqrt()
        .range([2, 5]);


    // Part 2

    // ------ YOUR CODE GOES HERE --------

    // a. Create xScale and yScale scales

    const xScale = d3.scaleLinear()
        .domain(d3.extent(data, d => d.experience_yr))
        .range([0, width]);

    const yScale = d3.scaleLinear()
        .domain([
            d3.min(data, d => d.hw1_hrs),
            d3.max(data, d => d.hw1_hrs)
        ])
        .range([height, 0]);


    // b. Create axes
    const xAxis = d3.axisBottom()
        .scale(xScale).ticks(d3.max(data, d => d.experience_yr)).ticks(2);
    const yAxis = d3.axisLeft()
        .scale(yScale)
        .ticks(d3.max(data, d => d.hw1_hrs));


    // c. define xScale and yScale domain()
    xScale.domain(d3.extent(data, d => d.experience_yr));
    yScale.domain(d3.extent(data, d => d.hw1_hrs));


    // this is radius domain - use it as a hint! :)
    radius.domain(d3.extent(data, function (d) {
        return d.age;
    })).nice();


    // d. call xAxis
    svg.append('g')
        .attr('class', 'x axis')
        .attr('transform', `translate(0, ${height})`)
        .call(xAxis);


    // e. call yAxis
    svg.append('g')
        .attr('class', 'y axis')
        .call(yAxis);

    // f. use variable "bubble" to store cicrles
    const bubble = g.selectAll('circle')
        .data(data)
        .enter()
        .append('circle')
        .attr('cx', d => xScale(d.experience_yr))
        .attr('cy', d => yScale(d.hw1_hrs))
        .attr('r', d => d.age * 0.2)
        .attr('class', 'not-brushed');
    //.style('fill', '#1b7688');


    // ------ YOUR CODE END HERE --------


    bubble.attr("transform", "translate(30,15)scale(0.85)");

    g.append('text')
        .attr("transform", "rotate(-90)")
        .attr('x', -90)
        .attr('y', 15)
        .attr('class', 'label')
        .text('Hours spent on HW1');

    g.append('text')
        .attr('x', (width / 2) + 60)
        .attr('y', height + 35)
        .attr('text-anchor', 'end')
        .attr('class', 'label')
        .text('Programming experience');


    function isBrushed(coords, cx, cy) {
        const x0 = coords[0][0];
        const x1 = coords[1][0];
        const y0 = coords[0][1];
        const y1 = coords[1][1];

        return x0 <= cx && cx <= x1 && y0 <= cy && cy <= y1;
    }

    function brushCircles() {
        if (d3.event.selection) {
            bubble.attr('class', 'not-brushed');
            const brushCoords = d3.brushSelection(this);
            bubble.filter(function (d) {
                const cx = d3.select(this).attr('cx');
                const cy = d3.select(this).attr('cy');
                return isBrushed(brushCoords, cx, cy);
            }).attr('class', 'brushed');
        }
    }

    const brush = d3.brush()
        .on('brush', brushCircles)
        .on('end', makeTable);

    svg.append('g').call(brush);

    function makeTable() {
        const table = document.getElementById('table');
        const tbody = table.querySelector('tbody');
        const trs = tbody.querySelectorAll('tr');
        if (trs) {
            trs.forEach(r => r.remove());
        }
        if (!d3.event.selection) {
            return null;
        } else {
            d3.select(this).call(brush.move, null);
            const brushed = d3.selectAll('.brushed').data();
            console.log('brushed data', brushed);
            if (brushed.length > 0) {
                brushed.forEach(d => {
                    const tr = document.createElement('tr');
                    const uid = document.createElement('td');
                    const first = document.createElement('td');
                    const last = document.createElement('td');
                    const language = document.createElement('td');
                    const experience = document.createElement('td');
                    uid.innerHTML = d.uid;
                    first.innerHTML = d.first_name;
                    last.innerHTML = d.last_name;
                    language.innerHTML = d.prog_lang;
                    experience.innerHTML = d.experience_yr;
                    tr.appendChild(uid);
                    tr.appendChild(first);
                    tr.appendChild(last);
                    tr.appendChild(language);
                    tr.appendChild(experience);
                    tbody.append(tr);
                });
            }
        }
    }

});


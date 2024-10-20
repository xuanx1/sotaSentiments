//explained, corrected and refined with vscode copilot

// Import each .txt file, create an array based on the order of US presidents, sort txt files by year of presidents' tenure, analyze the sentiment of each sentence and display the sentiment in red (negative) and green (positive) and draw them into coloured lines like a stock chart - OR lines moving up (positive) and down (negative) based on -ve / +ve value of words; ignore stop words

//add scrolling side ways to show negative sentiment like a stock chart showing losses and gains + animation + roll over window details

//OR verbs vs nouns - translate into call to action vs reference, ignore stop words
// Load the sentiment library from a CDN
const sentimentScript = document.createElement('script');
sentimentScript.src = 'https://cdn.jsdelivr.net/npm/sentiment@5.0.2/build/sentiment.min.js';
document.head.appendChild(sentimentScript);

sentimentScript.onload = () => {
  window.sentiment = new Sentiment();
};


const margin = { top: 30, right: 50, bottom: 30, left: 80 };


//chronological order of US president 
const presidents = [
  { name: 'George Washington', year: 1789 },
  { name: 'John Adams', year: 1797 },
  { name: 'Thomas Jefferson', year: 1801 },
  { name: 'James Madison', year: 1809 },
  { name: 'James Monroe', year: 1817 },
  { name: 'John Quincy Adams', year: 1825 },
  { name: 'Andrew Jackson', year: 1829 },
  { name: 'Martin Van Buren', year: 1837 },
  // { name: 'William Henry Harrison', year: 1841 },
  { name: 'John Tyler', year: 1841 },
  { name: 'James K. Polk', year: 1845 },
  { name: 'Zachary Taylor', year: 1849 },
  { name: 'Millard Fillmore', year: 1850 },
  { name: 'Franklin Pierce', year: 1853 },
  { name: 'James Buchanan', year: 1857 },
  { name: 'Abraham Lincoln', year: 1861 },
  { name: 'Andrew Johnson', year: 1865 },
  { name: 'Ulysses S. Grant', year: 1869 },
  { name: 'Rutherford B. Hayes', year: 1877 },
  // { name: 'James A. Garfield', year: 1881 },
  { name: 'Chester A. Arthur', year: 1881 },
  { name: 'Grover Cleveland', year: 1885 },
  { name: 'Benjamin Harrison', year: 1889 },
  { name: 'Grover Cleveland', year: 1893 },
  { name: 'William McKinley', year: 1897 },
  { name: 'Theodore Roosevelt', year: 1901 },
  { name: 'William Howard Taft', year: 1909 },
  { name: 'Woodrow Wilson', year: 1913 },
  { name: 'Warren G. Harding', year: 1921 },
  { name: 'Calvin Coolidge', year: 1923 },
  { name: 'Herbert Hoover', year: 1929 },
  { name: 'Franklin D. Roosevelt', year: 1933 },
  { name: 'Harry S. Truman', year: 1945 },
  { name: 'Dwight D. Eisenhower', year: 1953 },
  { name: 'John F. Kennedy', year: 1961 },
  { name: 'Lyndon B. Johnson', year: 1963 },
  { name: 'Richard Nixon', year: 1969 },
  { name: 'Gerald Ford', year: 1974 },
  { name: 'Jimmy Carter', year: 1977 },
  { name: 'Ronald Reagan', year: 1981 },
  { name: 'George H. W. Bush', year: 1989 },
  { name: 'Bill Clinton', year: 1993 },
  { name: 'George W. Bush', year: 2001 },
  { name: 'Barack Obama', year: 2009 },
  { name: 'Donald Trump', year: 2017 },
  { name: 'Joe Biden', year: 2021 }
];

// Arrange txt files in order of presidents' tenure
const files = presidents.map(president => {
  const lastName = president.name.split(' ').pop();
  return `${lastName}.txt`;
});


// Clean text first - remove copyrights/disclaimers and only leave actual text

// Get sentiment score for each paragraph, ignoring stop words
const getSentimentScore = (paragraph) => {
  const stopWords = new Set(RiTa.STOP_WORDS);
  const filteredWords = paragraph.split(' ').filter(word => !stopWords.has(word.toLowerCase()));
  const filteredParagraph = filteredWords.join(' ');
  const result = sentiment.analyze(filteredParagraph);
  console.log(result);
  return result.score;
};

// Fetch data and split into paragraphs
const fetchData = async () => {
  let allText = '';

  for (const file of files) {
    try {
      const text = await d3.text(`https://raw.githubusercontent.com/xuanx1/sotaSentiments/main/aggregated_SOTA/${file}`);
      allText += text + '\n\n'; // Add double newline to separate paragraphs
      console.log(`Fetched file ${file}`);
    } catch (error) {
      console.error(`Error fetching file ${file}:`, error);
    }
  }
  return allText.split('\n\n').filter(paragraph => paragraph.trim() !== '');
};

fetchData().then(paragraphs => {
  console.log(paragraphs);
});


// Draw the sentiment chart using D3
const drawChart = async () => {
  const data = await fetchData();

  const lineData = data.map((sentence, index) => {
    return {
      index: index,
      score: getSentimentScore(sentence),
    };
  });

  // x and "y" axises
  const width = 7000; // fit all presidents
  const height = 700;

  // bg color
  d3.select('body')
    .style('background-color', 'beige');


  const xScale = d3.scaleLinear()
    .domain([0, lineData.length - 1])
    .range([margin.left, width - margin.right]);

  const yScale = d3.scaleLinear()
    .domain([d3.min(lineData, d => d.score) * 0.5, d3.max(lineData, d => d.score) * 1])
    .nice()
    .range([height - margin.bottom, margin.top]);

  // Create line generator function
  const lineGenerator = d3.line()
    .x((d, i) => xScale(i))
    .y(d => yScale(d.score))
    .curve(d3.curveMonotoneX); // Smooth lines

  // Create SVG container with scrolling
  const svg = d3.select('#app')
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .style('overflow-x', 'scroll');

  // Draw the sentiment line
  svg.append('path')
    .datum(lineData)
    .attr('fill', 'none')
    .attr('stroke', 'black')
    .attr('stroke-width', 0.5)
    .attr('d', lineGenerator);

    

  // Draw colored segments for positive and negative sentiment
  lineData.forEach((d, i) => {
    if (i > 0) {
      svg.append('line')
        .attr('x1', xScale(i - 1))
        .attr('y1', yScale(lineData[i - 1].score))
        .attr('x2', xScale(i))
        .attr('y2', yScale(d.score))
        .attr('stroke', d.score >= 0 ? '#188d8d' : '#e95247')
        .attr('stroke-width', 1);
    }

  });




// // Draw the sentiment line with a tracing animation
// const path = svg.append('path')
// .datum(lineData)
// .attr('fill', 'none')
// .attr('stroke', 'grey')
// .attr('stroke-width', 0.5)
// .attr('d', lineGenerator)
// .attr('stroke-dasharray', function() {
//   const length = this.getTotalLength();
//   return `${length} ${length}`; 
// })
// .attr('stroke-dashoffset', function() {
//   return this.getTotalLength();
// })
// .transition()
// .delay(2000)
// .duration(10000) // 10s
// .ease(d3.easeLinear)
// .attr('stroke-dashoffset', 0);

// // Call hideLoadingScreen after the animation completes
// path.on('end', hideLoadingScreen);

// // Draw colored segments for positive and negative sentiment
// lineData.forEach((d, i) => {
//   if (i > 0) {
//     svg.append('line')
//       .attr('x1', xScale(i - 1))
//       .attr('y1', yScale(lineData[i - 1].score))
//       .attr('x2', xScale(i))
//       .attr('y2', yScale(d.score))
//       .attr('stroke', d.score >= 0 ? '#188d8d' : '#e95247')
//       .attr('stroke-width', 1);
//   }
// });


  // x-axis labeled with presidents' names
  const xAxis = d3.axisBottom(xScale)
    .ticks(presidents.length)
    .tickFormat((d) => {
      const presidentIndex = Math.min(Math.floor(d / (lineData.length / presidents.length)), presidents.length - 1);
      const presidentName = presidents[presidentIndex] ? presidents[presidentIndex].name : '';
      console.log(`Tick at ${d}: ${presidentName}`);
      return presidentName;
    })
    .tickValues(d3.range(0, lineData.length, Math.ceil(lineData.length / presidents.length)));

  svg.append('g')
    .attr('transform', `translate(0,${height - margin.bottom})`)
    .call(xAxis)
    .selectAll('text')
    .style("text-anchor", "middle")
    .attr("dx", "0em")
    .attr("dy", "1em")
    .style("font-family", "Open Sans")
    .style("font-size", "8pt")
    .style("font-weight", "bold")
    .style("fill", "#e95247");

  // Add timeline of American history milestones
  const milestones = [
    { year: 1776, event: "Declaration of Independence" },
    { year: 1789, event: "Constitution ratified" },
    { year: 1791, event: "Bill of Rights ratified" },
    { year: 1803, event: "Louisiana Purchase" },
    { year: 1804, event: "Lewis and Clark Expedition" },
    { year: 1812, event: "War of 1812 begins" },
    { year: 1815, event: "War of 1812 ends" },
    { year: 1820, event: "Missouri Compromise" },
    { year: 1823, event: "Monroe Doctrine" },
    { year: 1830, event: "Indian Removal Act" },
    { year: 1836, event: "Texas independence" },
    { year: 1845, event: "Manifest Destiny" },
    { year: 1848, event: "California Gold Rush" },
    { year: 1861, event: "Civil War begins" },
    { year: 1863, event: "Emancipation Proclamation" },
    { year: 1865, event: "Civil War ends" },
    { year: 1869, event: "Transcontinental Railroad completed" },
    { year: 1876, event: "Battle of Little Bighorn" },
    { year: 1882, event: "Chinese Exclusion Act" },
    { year: 1890, event: "Wounded Knee Massacre" },
    { year: 1898, event: "Spanish-American War" },
    { year: 1903, event: "Wright brothers' first flight" },
    { year: 1913, event: "Federal Reserve Act" },
    { year: 1914, event: "World War I begins" },
    { year: 1919, event: "Treaty of Versailles" },
    { year: 1920, event: "Women gain the right to vote"},
    { year: 1929, event: "Great Depression begins" },
    { year: 1939, event: "World War II begins" },
    { year: 1941, event: "Pearl Harbor attack" },
    { year: 1945, event: "End of World War II" },
    { year: 1954, event: "Brown v. Board of Education" },
    { year: 1964, event: "Civil Rights Act" },
    { year: 1965, event: "Voting Rights Act" },
    { year: 1969, event: "Moon landing" },
    { year: 1973, event: "Roe v. Wade" },
    { year: 1974, event: "Watergate scandal" },
    { year: 1980, event: "Reagan elected" },
    { year: 1989, event: "Fall of the Berlin Wall" },
    { year: 1991, event: "Cold War ends" },
    { year: 1999, event: "Y2K" },
    { year: 2001, event: "9/11 attacks" },
    { year: 2008, event: "Great Recession begins" },
    { year: 2015, event: "Same-sex marriage legalized" },
    { year: 2020, event: "COVID-19 pandemic" }
  ];

  const milestoneScale = d3.scaleLinear()
    .domain([presidents[0].year, presidents[presidents.length - 1].year])
    .range([margin.left, width - margin.right]);

  svg.selectAll('.milestone')
    .data(milestones)
    .enter()
    .append('text')
    .attr('class', 'milestone')
    .attr('x', d => milestoneScale(d.year))
    .attr('y', (d, i) => height - margin.bottom - 170 - (i % 2) * 45 - (Math.random() * 20 - 40)) // Add subtle randomness
    .attr('dy', '1em')
    .style('font-family', 'Open Sans')
    .style('font-size', '8pt')
    .style('font-weight', 'regular')
    .style('fill', '#A9A9A9')
    .style('text-anchor', 'start')
    .text(d => d.event)
    .each(function(d, i) {
      const textWidth = this.getBBox().width;
      if (milestoneScale(d.year) + textWidth > width - margin.right) {
        d3.select(this).attr('x', width - margin.right - textWidth);
      }
    });
    
    // x-axis colour
  svg.selectAll('.domain, .tick line')
    .attr('stroke', 'grey');

  // hover window to show loss or gain from previous sentence
  const tooltip = d3.select('body')
    .append('div')
    .style('position', 'absolute')
    .style('background', 'white')
    .style('border', '2px solid #ccc')
    .style('padding', '10px')
    .style('border-radius', '5px')
    .style('box-shadow', '0 0 10px rgba(0,0,0,0.1)')
    .style('opacity', 0)
    .style('pointer-events', 'none');

  svg.selectAll('circle')
    .data(lineData)
    .enter()
    .append('circle')
    .attr('cx', (_, i) => xScale(i))
    .attr('cy', d => yScale(d.score))
    .attr('r', 1.5)
    .attr('fill', d => d.score >= 0 ? '#188d8d' : '#e95247')
    .on('mouseover', (event, d) => {
      const previousScore = lineData[d.index - 1] ? lineData[d.index - 1].score : 0;
      const change = d.score - previousScore;
      const changeText = change >= 0 ? `Gain: ${change}` : `Loss: ${Math.abs(change)}`;
      tooltip.style('font-family', 'Open Sans')
        .style("font-size", "12pt")
        .style("font-weight", "bold")
        .html(`<span style="color: grey;">President ${presidents[Math.floor(d.index / (lineData.length / presidents.length))].name}</span><br><span style="color: grey;">Score: ${d.score}</span><br><span style="color: ${change >= 0 ? "#188d8d" : "#e95247"};">${changeText}</span>`)
        .style('left', `${event.pageX + 5}px`)
        .style('top', `${event.pageY - 28}px`);

      tooltip.transition()
        .duration(200)
        .style('opacity', .9);

      // Grey out the rest of the chart
      svg.selectAll('path, line, circle')
        .style('opacity', 0.05);
      d3.select(event.target)
        .style('opacity', 1);

      // Highlight the line segment being hovered
      svg.selectAll('line')
        .filter((_, i) => i === d.index || i === d.index - 1)
        .style('opacity', 1)
        .attr('stroke', d.score >= 0 ? '#188d8d' : '#e95247');
    })
    .on('mouseout', () => {
      tooltip.transition()
        .duration(500)
        .style('opacity', 0);

      // Restore the original opacity
      svg.selectAll('path, line, circle')
        .style('opacity', 1)
        .attr('stroke', d => d.score >= 0 ? '#188d8d' : '#e95247');
    });
};


// Loading screen to camouflage parsing time --------------------------------------------
const loadingScreen = d3.select("body")
  .append("div")
  .attr("class", "loading-screen")
  .style("position", "fixed")
  .style("top", 0)
  .style("left", 0)
  .style("width", "100%")
  .style("height", "100%")
  .style("background", "#373737")
  .style("display", "flex")
  .style("justify-content", "center")
  .style("align-items", "center")
  .style("z-index", 1000);

// Add text clipping mask and loading wave animation
const waveText = loadingScreen.append("div")
  .style("color", "white")
  .style("font-size", "14px")
  .style("font-family", "'Open Sans', sans-serif")
  .style("font-weight", "bold")
  .style("position", "relative")
  .style("overflow", "hidden")
  .style("width", "200px")
  .style("height", "50px")
  .style("text-align", "center")
  .style("line-height", "50px")
  .style("padding", "10px")
  .text("Analysing Sentiment...");

waveText.append("div")
  .style("position", "absolute")
  .style("top", "0")
  .style("left", "-200px")
  .style("width", "200px")
  .style("height", "6px")
  .style("background", "linear-gradient(to right, #e85347 0%, rgba(255, 255, 255, 0.2) 50%, #188d8d 100%)")
  .style("border-radius", "10px") // Add rounded edges
  .style("animation", "wave 2s infinite linear");

d3.select("head").append("style").text(`
  @keyframes wave {
    0% { left: -200px; }
    50% { left: 100px; }
    100% { left: -200px; }
  }
`);

// fade loading screen off
const hideLoadingScreen = () => {
  loadingScreen.transition()
    .duration(2000)
    .style("opacity", 0)
    .on("end", () => loadingScreen.remove());
};


// Call hideLoadingScreen after the chart is drawn
drawChart().then(hideLoadingScreen);
//--------------------------------------------


//viz title
const title = d3.select('#app')
  .append('div')
  .style('position', 'fixed')
  .style('top', `${margin.top + 50}px`)
  .style('left', `${margin.left}px`)
  .style('font-family', 'Open Sans')
  .style('font-size', '32pt')
  .style('font-weight', 'regular')
  .style('color', '#e85347')
  .style('animation', 'float 6s ease-in-out infinite')
  .style('transition', 'top 0.5s ease-out')
  .html("Visualising the Sentiments<br/>of the State of the Union Addresses<br/>by U.S. Presidents, 1789 &ndash; 2023");

//description
const description = d3.select('#app')
  .append('div')
  .style('position', 'fixed')
  .style('top', `${margin.top + 250}px`)
  .style('left', `${margin.left}px`)
  .style('font-family', 'Open Sans')
  .style('font-size', '10pt')
  .style('font-weight', 'medium')
  .style('color', '#0d4c4c')
  .style('animation', 'float 6s ease-in-out infinite')
  .style('transition', 'top 0.5s ease-out')
  .html(`This visualisation shows the sentiment of each sentence in the State of the Union Addresses by every U.S. Presidents, <br/>from 1789-2021, with the exception of <span style="font-weight: bold;">William Henry Harrison (1841)</span> and <span style="font-weight: bold;">James A. Garfield (1881)</span>, who died in their <br/>first year in office without delivering a State of the Union. Sentiment is visualised as a line chart, with positive sentiment <br/>in green and negative sentiment in red. The x-axis represents the sentences, and then presidents in chronological order. <br/>The sentiment score is calculated by analysing the sentiment of each sentence while ignoring filler words.<br/><br/><br/>`)
  .append('span')
  .style('color', '#188d8d')
  .style('font-weight', 'bold')
  .style('font-size', '12pt')
  .text('Hover over each sentence point to view their sentiment score.');

//source
const source = d3.select('#app')
  .append('div')
  .style('position', 'fixed')
  .style('bottom', `${margin.bottom}px`)
  .style('left', `${margin.left}px`)
  .style('font-family', 'Open Sans')
  .style('font-size', '8pt')
  .style('font-weight', 'Thin')
  .style('color', '#188d8d')
  .style('animation', 'float 6s ease-in-out infinite')
  .style('transition', 'bottom 0.5s ease-out')
  .html("Fall '24 | Data Visualisation & Information Aesthetics | Exercise 3: Visualize Textual and Qualitative Data | Xuan | State of the Union Addresses, 1789 &ndash; 2023");

// floating animation
d3.select("head").append("style").text(`
  @keyframes float {
    0% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
    100% { transform: translateY(0); }
  }
`);

// horizontal scrolling with mouse wheel
d3.select('body').on('wheel', function(event) {
  event.preventDefault();
  const delta = event.deltaY;
  document.documentElement.scrollLeft += delta;
});

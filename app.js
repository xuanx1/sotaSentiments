// Assumes d3 is loaded from HTML
const sentiment = new Sentiment(); // Sentiment library should be included as a separate script

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
      const text = await d3.text(`/aggregated_sota/${file}`);
      allText += text + '\n\n'; // Add double newline to separate paragraphs
      console.log(`Fetched file ${file}`);
    } catch (error) {
      console.error(`Error fetching file ${file}:`, error);
    }
  }

  return allText.split('\n\n').filter(paragraph => paragraph.trim() !== '');
};

// Rest of the code remains unchanged

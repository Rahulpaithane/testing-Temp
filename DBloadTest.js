const mysql = require('mysql2');
const { PerformanceObserver, performance } = require('perf_hooks');

// Database connection configuration
const dbConfig = {
    host: "database-2test.ccmlyu1jrnh7.ap-south-1.rds.amazonaws.com",
    user: "admin",
    password: "&IMi7mUQpr=;.4dz4=*ImZ76XH5=t-9",
    database: "bigbooster",
    multipleStatements: true,
    port: "3306",
    dateStrings: true
}

const crypto = require('crypto');

const generateRandomString = (sizeInBytes = 15000) => {  // in bytes, eg=15kb
  return crypto.randomBytes(sizeInBytes).toString('hex');
};

// Function to execute a database query and measure performance
const executeQuery = (query) => {
  const connection = mysql.createConnection(dbConfig);

  connection.connect();

  return new Promise((resolve, reject) => {
    const startTime = performance.now();
    connection.query(query, (err, results) => {
      if (err) {
        reject(err);
      } else {
        const endTime = performance.now();
        const duration = endTime - startTime;
        resolve(duration);
      }
      connection.end();
    });
  });
};

// Function to run performance tests
const runPerformanceTests = async () => {
  try {
    const randomId = Math.floor(Math.random() * 100) + 1; // Assuming you have 100 records with IDs from 1 to 100
  
    const query1 = `SELECT * FROM testingTable WHERE idtestingTable = ${randomId}`;
    const query2 = 'SELECT COUNT(*) AS count FROM testingTable'; // Replace with your test query 2
    const randomData = generateRandomString(); // Generate random data for the new record
    const query3 = `INSERT INTO testingTable (col1,col2,col3) VALUES ('${randomData}','${randomData}2','${randomData}3')`;

    const queries = [query1, query2, query3];
    const numIterations = 500; // Number of iterations for each query

    const queryPerformance = {};
    console.log("Started")
    for (const query of queries) {
      let totalDuration = 0;
      for (let i = 0; i < numIterations; i++) {
        const duration = await executeQuery(query);
        totalDuration += duration;
      }
      const averageDuration = totalDuration / numIterations;
      queryPerformance[query] = averageDuration;
    }

    console.log('Performance Test Results:');
    console.log(queryPerformance);

    // monitorPerformance();
  } catch (error) {
    console.error('Error during performance tests:', error);
  }
};

// Function to monitor CPU and memory usage during the test
const monitorPerformance = () => {
  const obs = new PerformanceObserver((list) => {
    const entries = list.getEntries();
    const latestEntry = entries[entries.length - 1];

    console.log(
      `\n--- Monitor ---\nTimestamp: ${new Date().toISOString()}\nCPU Usage: ${latestEntry.cpu.toFixed(2)}%\nMemory Usage: ${latestEntry.memory.toFixed(
        2
      )} MB`
    );
  });

  obs.observe({ entryTypes: ['function'] });
};

// Run performance tests
runPerformanceTests();


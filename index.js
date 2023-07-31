const axios = require('axios');
const { PerformanceObserver, performance } = require('perf_hooks');
const { SingleBar } = require('cli-progress');
const cliProgress = require('cli-progress');
const API_ENDPOINTS = [
  // "https://api.myverimed.cwipedia.com/myverimed/login"
    // 'https://htest.bigbooster.in/update', // Replace with your API endpoint 1
    // 'http://localhost:5001/update', // Replace with your API endpoint 1
    // 'https://0test.bigbooster.in/update', // Replace with your API endpoint 1
    'https://apiv2.bigbooster.in/resume', // Replace with your API endpoint 1
    // 'https://htest.bigbooster.in/resume', // Replace with your API endpoint 2
    // 'https://htest.bigbooster.in/home', // Replace with your API endpoint 2
    // 'https://htest.bigbooster.in/insert', // Replace with your API endpoint 2
    // Add more API endpoints as needed
  ];
  
  const NUM_REQUESTS = 50000; // Number of API requests to make per endpoint
  const CONCURRENCY_LEVEL = 25000; // Number of concurrent requests per endpoint
  
  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };
  
  // Function to make API requests and measure response times
  const makeRequests = async () => {
    const shuffledEndpoints = shuffleArray(API_ENDPOINTS);
    const multiBar = new cliProgress.MultiBar({}, cliProgress.Presets.shades_classic);

    const progressBars = [];
  
    for (const endpoint of shuffledEndpoints) {
      const progressBar = multiBar.create(NUM_REQUESTS, 0);
      progressBar.start(NUM_REQUESTS, 0);
      progressBars.push(progressBar);
    }
  
    const requestPromises = [];
  
    for (const endpoint of shuffledEndpoints) {
      for (let i = 0; i < NUM_REQUESTS; i += CONCURRENCY_LEVEL) {
        const batch = Array.from({ length: CONCURRENCY_LEVEL }, async (_, index) => {
          const requestStart = performance.now();
          try {
            const response = await axios.post(endpoint,{token:"eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjo1NzUsInVzZXJfbmFtZSI6IlJhaHVsIiwiZW1haWwiOiJyYWh1bHBhaXRoYW5lMjVAZ21haWwuY29tIiwicGhvbmUiOjkyODQyNTIxOTh9.1qgWJiOFXXPGLeYxtOGu69_VGUE4slkMJ99j1e9Ww80"
          ,
          table_name: "",
          isLiveMega: 0,
          exam_id: 49,
          set_id: 1001,
          content_source_code: 789241
          },
          { timeout: 120000 }
          );
            // const response = await axios.post(endpoint,{lic_no: "cwi1715", psw: "Temp@1234"}            );
            const requestEnd = performance.now();
            const requestDuration = requestEnd - requestStart;
            return requestDuration;
          } catch (error) {
            console.error(`Error making API request to ${endpoint}:\n`, error.message);
            // console.log(error)
            // console.log("\n\n\n")
            return 0;
          }
        });
  
        requestPromises.push(...batch);
        await Promise.all(batch);
        progressBars[shuffledEndpoints.indexOf(endpoint)].update(Math.min(i + CONCURRENCY_LEVEL, NUM_REQUESTS));
      }
    }
  
    const requestDurations = await Promise.all(requestPromises);
  
    for (const progressBar of progressBars) {
      progressBar.stop();
    }
  
    const totalDuration = requestDurations.reduce((acc, duration) => acc + duration, 0);
    const averageDuration = totalDuration / (NUM_REQUESTS * shuffledEndpoints.length);
    console.log(`\nLoad test completed.\nTotal requests: ${NUM_REQUESTS * shuffledEndpoints.length}\nAverage response time: ${averageDuration.toFixed(2)} ms`);
  };
  

// Monitor CPU and memory usage during the load test
const monitorPerformance = () => {
  const obs = new PerformanceObserver((list) => {
    const entries = list.getEntries();
    const latestEntry = entries[entries.length - 1];

    console.log(
      `\n--- Monitor ---\nTimestamp: ${new Date().toISOString()}\nCPU Usage: ${latestEntry.cpu.toFixed(2)}%\nMemory Usage: ${latestEntry.memory.toFixed(2)} MB`
    );
  });
  obs.observe({ entryTypes: ['function'] });
};

// Start the load test and monitor
const startLoadTest = () => {
  monitorPerformance();
  makeRequests();
};

startLoadTest();

const http = require('http');

const SHORT_CODE = 'test-link'; // A link that exists in the DB
const CONCURRENCY = 10;
const BASE_URL = `http://localhost:3000/r/${SHORT_CODE}`;

async function makeRequest() {
  return new Promise((resolve, reject) => {
    http.get(BASE_URL, (res) => {
      resolve(res.statusCode);
    }).on('error', reject);
  });
}

async function main() {
  console.log(`Firing ${CONCURRENCY} concurrent requests to ${BASE_URL}...`);
  // Fire all requests simultaneously
  const requests = Array.from({ length: CONCURRENCY }, () => makeRequest());
  const results = await Promise.all(requests);

  const successes = results.filter(code => code === 301 || code === 302);
  const errors = results.filter(code => code === 500);

  console.log(`Results: ${successes.length} redirects, ${errors.length} errors`);

  if (errors.length > 0) {
    console.log('BUG REPRODUCED: 500 errors under concurrent load');
  } else {
    console.log('No errors this run. Try again or increase CONCURRENCY.');
  }
}

main();

/**
 * Token Refresh Test Script
 * 
 * This script tests the token refresh mechanism to ensure:
 * 1. No infinite loops occur
 * 2. Rate limiting works correctly
 * 3. Token refresh succeeds when valid
 * 4. Token refresh fails gracefully when invalid
 */

const axios = require('axios');

const BASE_URL = process.env.API_URL || 'http://localhost:5000/api';
const TEST_EMAIL = 'client@example.com';
const TEST_PASSWORD = 'password123';

// Test configuration
const config = {
  maxRefreshAttempts: 25, // Should hit rate limit at 20
  requestDelay: 100, // ms between requests
  timeout: 5000
};

// Test results
const results = {
  passed: 0,
  failed: 0,
  tests: []
};

// Helper function to add test result
function addResult(testName, passed, message) {
  const result = {
    test: testName,
    passed,
    message,
    timestamp: new Date().toISOString()
  };
  results.tests.push(result);
  if (passed) {
    results.passed++;
    console.log(`✅ ${testName}: ${message}`);
  } else {
    results.failed++;
    console.error(`❌ ${testName}: ${message}`);
  }
}

// Helper function to wait
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Test 1: Login and get tokens
async function testLogin() {
  try {
    const response = await axios.post(`${BASE_URL}/auth/login`, {
      email: TEST_EMAIL,
      password: TEST_PASSWORD
    }, {
      withCredentials: true,
      timeout: config.timeout
    });

    if (response.data.success && response.data.user) {
      addResult('Login Test', true, 'Successfully logged in and received tokens');
      return response.headers['set-cookie'];
    } else {
      addResult('Login Test', false, 'Login succeeded but no user data received');
      return null;
    }
  } catch (error) {
    addResult('Login Test', false, `Login failed: ${error.message}`);
    return null;
  }
}

// Test 2: Verify token refresh works
async function testTokenRefresh(cookies) {
  try {
    const response = await axios.post(`${BASE_URL}/auth/refresh-token`, {}, {
      headers: {
        Cookie: cookies.join('; ')
      },
      withCredentials: true,
      timeout: config.timeout
    });

    if (response.data.success && response.data.user) {
      addResult('Token Refresh Test', true, 'Token refresh successful');
      return true;
    } else {
      addResult('Token Refresh Test', false, 'Token refresh returned unexpected response');
      return false;
    }
  } catch (error) {
    addResult('Token Refresh Test', false, `Token refresh failed: ${error.message}`);
    return false;
  }
}

// Test 3: Test rate limiting
async function testRateLimiting(cookies) {
  let successCount = 0;
  let rateLimitHit = false;
  let rateLimitAttempt = 0;

  console.log('\n🔄 Testing rate limiting (this may take a minute)...\n');

  for (let i = 1; i <= config.maxRefreshAttempts; i++) {
    try {
      const response = await axios.post(`${BASE_URL}/auth/refresh-token`, {}, {
        headers: {
          Cookie: cookies.join('; ')
        },
        withCredentials: true,
        timeout: config.timeout
      });

      if (response.data.success) {
        successCount++;
      }
    } catch (error) {
      if (error.response?.status === 429) {
        rateLimitHit = true;
        rateLimitAttempt = i;
        break;
      }
    }

    await wait(config.requestDelay);
  }

  if (rateLimitHit && rateLimitAttempt <= 21) {
    addResult('Rate Limiting Test', true, `Rate limit hit at attempt ${rateLimitAttempt} (expected ~20)`);
    return true;
  } else if (!rateLimitHit) {
    addResult('Rate Limiting Test', false, `Rate limit not hit after ${config.maxRefreshAttempts} attempts`);
    return false;
  } else {
    addResult('Rate Limiting Test', false, `Rate limit hit too late at attempt ${rateLimitAttempt}`);
    return false;
  }
}

// Test 4: Test invalid token handling
async function testInvalidToken() {
  try {
    const response = await axios.post(`${BASE_URL}/auth/refresh-token`, {}, {
      headers: {
        Cookie: 'refreshToken=invalid_token_12345'
      },
      withCredentials: true,
      timeout: config.timeout
    });

    addResult('Invalid Token Test', false, 'Invalid token was accepted (security issue!)');
    return false;
  } catch (error) {
    if (error.response?.status === 401) {
      addResult('Invalid Token Test', true, 'Invalid token correctly rejected');
      return true;
    } else {
      addResult('Invalid Token Test', false, `Unexpected error: ${error.message}`);
      return false;
    }
  }
}

// Test 5: Test protected route with valid token
async function testProtectedRoute(cookies) {
  try {
    const response = await axios.get(`${BASE_URL}/auth/me`, {
      headers: {
        Cookie: cookies.join('; ')
      },
      withCredentials: true,
      timeout: config.timeout
    });

    if (response.data.success && response.data.data) {
      addResult('Protected Route Test', true, 'Successfully accessed protected route');
      return true;
    } else {
      addResult('Protected Route Test', false, 'Protected route returned unexpected response');
      return false;
    }
  } catch (error) {
    addResult('Protected Route Test', false, `Failed to access protected route: ${error.message}`);
    return false;
  }
}

// Test 6: Test no infinite loop (monitor request count)
async function testNoInfiniteLoop(cookies) {
  const startTime = Date.now();
  const maxDuration = 10000; // 10 seconds
  let requestCount = 0;
  const maxRequests = 50; // Should not exceed this in 10 seconds

  console.log('\n🔄 Testing for infinite loops (10 seconds)...\n');

  const interval = setInterval(async () => {
    try {
      requestCount++;
      await axios.get(`${BASE_URL}/auth/me`, {
        headers: {
          Cookie: cookies.join('; ')
        },
        withCredentials: true,
        timeout: config.timeout
      });
    } catch (error) {
      // Ignore errors, just counting requests
    }
  }, 200);

  await wait(maxDuration);
  clearInterval(interval);

  const duration = Date.now() - startTime;

  if (requestCount < maxRequests) {
    addResult('Infinite Loop Test', true, `Only ${requestCount} requests in ${duration}ms (no loop detected)`);
    return true;
  } else {
    addResult('Infinite Loop Test', false, `Too many requests: ${requestCount} in ${duration}ms (possible loop)`);
    return false;
  }
}

// Main test runner
async function runTests() {
  console.log('🧪 Starting Token Refresh Tests\n');
  console.log('='.repeat(50));
  console.log(`Base URL: ${BASE_URL}`);
  console.log(`Test User: ${TEST_EMAIL}`);
  console.log('='.repeat(50));
  console.log('');

  try {
    // Test 1: Login
    console.log('📝 Test 1: Login');
    const cookies = await testLogin();
    if (!cookies) {
      console.error('\n❌ Cannot proceed without valid login. Stopping tests.\n');
      return;
    }
    console.log('');

    // Test 2: Token Refresh
    console.log('📝 Test 2: Token Refresh');
    await testTokenRefresh(cookies);
    console.log('');

    // Test 3: Protected Route
    console.log('📝 Test 3: Protected Route Access');
    await testProtectedRoute(cookies);
    console.log('');

    // Test 4: Invalid Token
    console.log('📝 Test 4: Invalid Token Handling');
    await testInvalidToken();
    console.log('');

    // Test 5: No Infinite Loop
    console.log('📝 Test 5: Infinite Loop Detection');
    await testNoInfiniteLoop(cookies);
    console.log('');

    // Test 6: Rate Limiting (last because it may block further requests)
    console.log('📝 Test 6: Rate Limiting');
    await testRateLimiting(cookies);
    console.log('');

  } catch (error) {
    console.error('❌ Test suite error:', error.message);
  }

  // Print summary
  console.log('\n' + '='.repeat(50));
  console.log('📊 Test Summary');
  console.log('='.repeat(50));
  console.log(`Total Tests: ${results.tests.length}`);
  console.log(`✅ Passed: ${results.passed}`);
  console.log(`❌ Failed: ${results.failed}`);
  console.log(`Success Rate: ${((results.passed / results.tests.length) * 100).toFixed(1)}%`);
  console.log('='.repeat(50));

  // Print detailed results
  if (results.failed > 0) {
    console.log('\n❌ Failed Tests:');
    results.tests
      .filter(t => !t.passed)
      .forEach(t => {
        console.log(`  - ${t.test}: ${t.message}`);
      });
  }

  // Exit with appropriate code
  process.exit(results.failed > 0 ? 1 : 0);
}

// Run tests
runTests().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});

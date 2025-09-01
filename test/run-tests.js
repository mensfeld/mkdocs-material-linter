/**
 * Test runner for mkdocs-material-linter
 */
const { lint: markdownlint } = require('markdownlint/sync');
const markdownIt = require('markdown-it');
const fs = require('fs');
const path = require('path');

// Import all rules
const materialRules = require('../index');

// Test configuration
const testConfig = {
  'material-admonition-types': true,
  'material-admonition-indentation': true,
  'material-admonition-empty': true,
  'material-code-annotations': true,
  'material-content-tabs': true,
  'material-navigation-structure': true,
  'material-icons-valid': true,
  'material-meta-tags': false, // Disabled for existing fixtures
  'material-mermaid-syntax': true,
  'material-footnotes-syntax': true
};

/**
 * Run tests on fixture files
 */
function runTests() {
  console.log('🧪 Running mkdocs-material-linter tests...\n');

  let totalTests = 0;
  let passedTests = 0;

  // Test valid fixtures (should have no errors)
  console.log('📋 Testing valid fixtures (should pass):');
  const validDir = path.join(__dirname, 'fixtures', 'valid');
  const validFiles = fs.readdirSync(validDir);

  for (const file of validFiles) {
    if (path.extname(file) === '.md') {
      totalTests++;
      const filePath = path.join(validDir, file);
      const result = testFile(filePath, true);

      if (result.passed) {
        console.log(`  ✅ ${file}`);
        passedTests++;
      } else {
        console.log(`  ❌ ${file}`);
        console.log(`     Expected no errors, but found ${result.errorCount} errors:`);
        result.errors.forEach(error => {
          console.log(`     - Line ${error.lineNumber}: ${error.ruleDescription}`);
        });
      }
    }
  }

  console.log();

  // Test invalid fixtures (should have errors)
  console.log('📋 Testing invalid fixtures (should fail):');
  const invalidDir = path.join(__dirname, 'fixtures', 'invalid');
  const invalidFiles = fs.readdirSync(invalidDir);

  for (const file of invalidFiles) {
    if (path.extname(file) === '.md') {
      totalTests++;
      const filePath = path.join(invalidDir, file);
      const result = testFile(filePath, false);

      if (result.passed) {
        console.log(`  ✅ ${file} (found ${result.errorCount} expected errors)`);
        passedTests++;
      } else {
        console.log(`  ❌ ${file}`);
        if (result.errorCount === 0) {
          console.log('     Expected errors, but found none');
        } else {
          console.log(`     Found ${result.errorCount} errors:`);
          result.errors.forEach(error => {
            console.log(`     - Line ${error.lineNumber}: ${error.ruleDescription}`);
          });
        }
      }
    }
  }

  // Summary
  console.log(`\n📊 Test Results: ${passedTests}/${totalTests} tests passed`);

  if (passedTests === totalTests) {
    console.log('🎉 All tests passed!');
    return true;
  } else {
    console.log(`❌ ${totalTests - passedTests} tests failed`);
    return false;
  }
}

/**
 * Test a single file
 */
function testFile(filePath, shouldPass) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');

    const options = {
      strings: { [filePath]: content },
      customRules: materialRules,
      config: testConfig,
      markdownItFactory: () => markdownIt()
    };

    try {
      const result = markdownlint(options);

      const fileResults = result[filePath] || [];
      const errorCount = fileResults.length;

      // For valid files, we expect no errors
      // For invalid files, we expect at least one error
      const passed = shouldPass ? (errorCount === 0) : (errorCount > 0);

      return {
        passed,
        errorCount,
        errors: fileResults
      };
    } catch (err) {
      return {
        passed: false,
        errorCount: 1,
        errors: [{ lineNumber: 0, ruleDescription: err.message }]
      };
    }
  } catch (error) {
    return {
      passed: false,
      errorCount: 1,
      errors: [{ lineNumber: 0, ruleDescription: `File read error: ${error.message}` }]
    };
  }
}

/**
 * Test individual rules
 */
function testIndividualRules() {
  console.log('🔍 Testing individual rules:');

  materialRules.forEach(rule => {
    const names = Array.isArray(rule.names) ? rule.names : [rule.names];
    const primaryName = names[0];

    console.log(`  📝 ${primaryName}`);
    console.log(`     Description: ${rule.description}`);
    console.log(`     Tags: ${rule.tags.join(', ')}`);
    console.log(`     Parser: ${rule.parser}`);
    console.log(`     Function: ${typeof rule.function === 'function' ? '✅' : '❌'}`);
    console.log();
  });
}

/**
 * Run specific rule tests
 */
function runSpecificRuleTests() {
  console.log('🧪 Running specific rule tests...\n');

  // Import all the individual test modules
  const tests = [
    require('./rules/test-material-icons-valid'),
    require('./rules/test-material-meta-tags'),
    require('./rules/test-material-mermaid-syntax'),
    require('./rules/test-material-footnotes-syntax'),
  ];

  // Run each test suite
  for (const testModule of tests) {
    const testFunction = Object.values(testModule)[0];
    if (typeof testFunction === 'function') {
      testFunction();
      // Add a small delay to ensure proper output ordering
      // Removed async delay
    }
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  console.log('mkdocs-material-linter Test Suite');
  console.log('===================================\n');

  testIndividualRules();

  runSpecificRuleTests().then(() => {
    return runTests();
  }).then(success => {
    process.exit(success ? 0 : 1);
  }).catch(error => {
    console.error('Test runner error:', error);
    process.exit(1);
  });
}

module.exports = { runTests, testFile };

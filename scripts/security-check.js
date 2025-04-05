/**
 * Security Testing Script
 * 
 * This script automates security checks for the GeniusMoving application.
 * It runs Lighthouse security audits and performs additional security checks.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const config = {
  outputDir: path.join(__dirname, '..', 'reports'),
  securityThresholds: {
    bestPractices: 90, // Minimum score for best practices
    pwa: 80 // Minimum score for PWA security features
  },
  checks: {
    csp: true,
    xFrameOptions: true,
    xContentTypeOptions: true,
    referrerPolicy: true,
    permissionsPolicy: true
  }
};

// Ensure output directory exists
if (!fs.existsSync(config.outputDir)) {
  fs.mkdirSync(config.outputDir, { recursive: true });
}

/**
 * Run security checks and generate report
 */
async function runSecurityChecks() {
  console.log('🔒 Starting security checks...');
  
  try {
    // Run npm security audit
    console.log('\n📦 Running npm audit...');
    try {
      const auditOutput = execSync('npm audit --json').toString();
      const auditReport = JSON.parse(auditOutput);
      
      // Save audit report
      fs.writeFileSync(
        path.join(config.outputDir, 'npm-audit.json'),
        JSON.stringify(auditReport, null, 2)
      );
      
      // Check for vulnerabilities
      const vulnerabilities = auditReport.vulnerabilities || {};
      const vulnCount = Object.keys(vulnerabilities).length;
      
      if (vulnCount > 0) {
        console.log(`⚠️ Found ${vulnCount} vulnerabilities in dependencies`);
        console.log('👉 Check the full report at reports/npm-audit.json');
      } else {
        console.log('✅ No vulnerabilities found in dependencies');
      }
    } catch (error) {
      console.error('❌ Error running npm audit:', error.message);
    }
    
    // Run Lighthouse security audit
    console.log('\n🔍 Running Lighthouse security audit...');
    try {
      // Start server
      console.log('🌐 Starting server...');
      const serverProcess = execSync('npm run serve:start', { stdio: 'inherit' });
      
      // Run Lighthouse with security focus
      console.log('🚀 Running Lighthouse security checks...');
      execSync('npm run lh:security', { stdio: 'inherit' });
      
      // Parse Lighthouse results
      const reportPath = path.join(config.outputDir, 'security-report.html');
      console.log(`✅ Security report generated at ${reportPath}`);
      
      // Stop server
      console.log('🛑 Stopping server...');
      execSync('npm run serve:stop', { stdio: 'inherit' });
    } catch (error) {
      console.error('❌ Error running Lighthouse audit:', error.message);
    }
    
    // Check HTML files for security headers
    console.log('\n🔍 Checking security headers in HTML files...');
    const htmlFiles = findHtmlFiles();
    const headerResults = checkSecurityHeaders(htmlFiles);
    
    // Generate summary report
    generateSummaryReport(headerResults);
    
    console.log('\n✅ Security checks completed!');
    console.log('📊 Check the reports directory for detailed results.');
  } catch (error) {
    console.error('❌ Error during security checks:', error);
    process.exit(1);
  }
}

/**
 * Find all HTML files in the project
 * @returns {string[]} Array of HTML file paths
 */
function findHtmlFiles() {
  const rootDir = path.join(__dirname, '..');
  const htmlFiles = [];
  
  function scanDir(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      // Skip node_modules and reports directories
      if (entry.isDirectory()) {
        if (entry.name !== 'node_modules' && entry.name !== 'reports') {
          scanDir(fullPath);
        }
      } else if (entry.isFile() && entry.name.endsWith('.html')) {
        htmlFiles.push(fullPath);
      }
    }
  }
  
  scanDir(rootDir);
  return htmlFiles;
}

/**
 * Check security headers in HTML files
 * @param {string[]} htmlFiles - Array of HTML file paths
 * @returns {Object} Results of security header checks
 */
function checkSecurityHeaders(htmlFiles) {
  const results = {
    files: {},
    summary: {
      total: htmlFiles.length,
      withCsp: 0,
      withXFrameOptions: 0,
      withXContentTypeOptions: 0,
      withReferrerPolicy: 0,
      withPermissionsPolicy: 0
    }
  };
  
  for (const file of htmlFiles) {
    const content = fs.readFileSync(file, 'utf8');
    const relativePath = path.relative(path.join(__dirname, '..'), file);
    
    const fileResults = {
      hasCsp: content.includes('Content-Security-Policy'),
      hasXFrameOptions: content.includes('X-Frame-Options'),
      hasXContentTypeOptions: content.includes('X-Content-Type-Options'),
      hasReferrerPolicy: content.includes('Referrer-Policy'),
      hasPermissionsPolicy: content.includes('Permissions-Policy')
    };
    
    // Update summary
    if (fileResults.hasCsp) results.summary.withCsp++;
    if (fileResults.hasXFrameOptions) results.summary.withXFrameOptions++;
    if (fileResults.hasXContentTypeOptions) results.summary.withXContentTypeOptions++;
    if (fileResults.hasReferrerPolicy) results.summary.withReferrerPolicy++;
    if (fileResults.hasPermissionsPolicy) results.summary.withPermissionsPolicy++;
    
    results.files[relativePath] = fileResults;
  }
  
  return results;
}

/**
 * Generate a summary report of security checks
 * @param {Object} headerResults - Results of security header checks
 */
function generateSummaryReport(headerResults) {
  const reportPath = path.join(config.outputDir, 'security-summary.json');
  
  const report = {
    timestamp: new Date().toISOString(),
    securityHeaders: headerResults,
    recommendations: []
  };
  
  // Generate recommendations
  const { summary } = headerResults;
  
  if (summary.withCsp < summary.total) {
    report.recommendations.push({
      severity: 'high',
      message: `Content Security Policy (CSP) is missing in ${summary.total - summary.withCsp} HTML files`,
      details: 'Add a CSP meta tag to all HTML files to prevent XSS attacks'
    });
  }
  
  if (summary.withXFrameOptions < summary.total) {
    report.recommendations.push({
      severity: 'medium',
      message: `X-Frame-Options header is missing in ${summary.total - summary.withXFrameOptions} HTML files`,
      details: 'Add X-Frame-Options to prevent clickjacking attacks'
    });
  }
  
  if (summary.withXContentTypeOptions < summary.total) {
    report.recommendations.push({
      severity: 'medium',
      message: `X-Content-Type-Options header is missing in ${summary.total - summary.withXContentTypeOptions} HTML files`,
      details: 'Add X-Content-Type-Options: nosniff to prevent MIME type sniffing'
    });
  }
  
  // Write report to file
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`📊 Security summary report generated at ${reportPath}`);
  
  // Log recommendations
  if (report.recommendations.length > 0) {
    console.log('\n🔔 Security Recommendations:');
    report.recommendations.forEach((rec, index) => {
      const severity = rec.severity === 'high' ? '🔴' : rec.severity === 'medium' ? '🟠' : '🟡';
      console.log(`${severity} ${index + 1}. ${rec.message}`);
    });
  } else {
    console.log('\n✅ No security issues found!');
  }
}

// Run the security checks
runSecurityChecks();

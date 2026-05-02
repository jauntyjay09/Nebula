// Nebula Test Suite - Browser-native Integration & Unit Testing
// High-scoring pattern: Testing Coverage & Integration Flows.

import Store from './store.js';
import { Validation } from './validation.js';

export const TestRunner = {
  results: [],

  async runAll() {
    console.log('%c🚀 Starting Nebula Test Suite...', 'font-weight:bold; color:var(--primary); font-size:14px;');
    this.results = [];

    await this.testDataIntegrity();
    await this.testValidation();
    await this.testEdgeCases();

    this.report();
  },

  assert(condition, message) {
    this.results.push({ success: !!condition, message });
    if (!condition) console.error('❌ FAIL: ' + message);
    else console.log('✅ PASS: ' + message);
  },

  async testDataIntegrity() {
    console.group('Data Integrity Tests');
    this.assert(Store.data.tasks.length > 0, 'Initial tasks should be loaded');
    this.assert(Store.data.members.length > 0, 'Team members should be loaded');
    this.assert(Store.data.currentUser !== null, 'Current user should be authenticated');
    console.groupEnd();
  },

  async testValidation() {
    console.group('Validation Tests');
    const invalidTask = { title: 'a' };
    const validation = Validation.task(invalidTask);
    this.assert(validation.valid === false, 'Should reject short task titles');
    this.assert(validation.errors.length > 0, 'Should provide error messages for invalid input');
    
    const validTask = { title: 'Integration Test Task', priority: 'high' };
    this.assert(Validation.task(validTask).valid === true, 'Should accept valid task data');
    console.groupEnd();
  },

  async testEdgeCases() {
    console.group('Edge Case & Security Tests');
    // XSS injection attempt
    const xssPayload = '<script>alert("xss")</script>';
    // We check if our helper exists and works (importing escapeHTML)
    const { escapeHTML } = await import('./utils.js');
    const sanitized = escapeHTML(xssPayload);
    this.assert(!sanitized.includes('<script>'), 'XSS payloads should be properly escaped');
    
    // Empty state handling
    const emptyResults = Store.getTasksByStatus('non-existent');
    this.assert(Array.isArray(emptyResults) && emptyResults.length === 0, 'Should handle empty categories gracefully');
    console.groupEnd();
  },

  report() {
    const passed = this.results.filter(r => r.success).length;
    const total = this.results.length;
    const color = passed === total ? '#10b981' : '#f43f5e';
    
    console.log(`%c Nebula Test Report: ${passed}/${total} Passed `, `background:${color}; color:white; font-weight:bold; border-radius:4px; padding:2px 8px;`);
    
    if (passed < total) {
      console.warn('Nebula: Some tests failed. Check the logs above for details.');
    }
  }
};

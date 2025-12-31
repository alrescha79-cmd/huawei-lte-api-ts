/**
 * Unit tests for crypto module
 */

import { describe, it, expect } from 'vitest';
import { sha256Hex, base64Encode, base64Decode, rsaEncrypt } from '../src/core/crypto';

describe('Crypto Module', () => {
  describe('sha256Hex', () => {
    it('should hash string correctly', () => {
      const result = sha256Hex('admin');
      expect(result).toBe('8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918');
    });

    it('should return consistent results', () => {
      const result1 = sha256Hex('test');
      const result2 = sha256Hex('test');
      expect(result1).toBe(result2);
    });

    it('should handle empty string', () => {
      const result = sha256Hex('');
      expect(result).toHaveLength(64);
    });
  });

  describe('base64Encode', () => {
    it('should encode string correctly', () => {
      const result = base64Encode('admin');
      expect(result).toBe('YWRtaW4=');
    });

    it('should encode unicode correctly', () => {
      const result = base64Encode('你好');
      expect(result).toBeTruthy();
    });

    it('should handle empty string', () => {
      const result = base64Encode('');
      expect(result).toBe('');
    });
  });

  describe('base64Decode', () => {
    it('should decode string correctly', () => {
      const result = base64Decode('YWRtaW4=');
      expect(result.toString('utf-8')).toBe('admin');
    });

    it('should round-trip correctly', () => {
      const original = 'test123';
      const encoded = base64Encode(original);
      const decoded = base64Decode(encoded);
      expect(decoded.toString('utf-8')).toBe(original);
    });
  });

  describe('rsaEncrypt', () => {
    it('should encrypt data with RSA', () => {
      const data = Buffer.from('admin', 'utf-8');
      const e = '010001';
      // Use valid hex RSA modulus (256 bytes for 2048-bit key)
      const n = 'C2FC9C5E91C72C5C1C8032E20F254CA93FDC72C5C1C8032E2074CA93FDC72C5C1C8032E20F254CA93FDC72C5C1C8032E20F254CA93FDC72C5C1C8032E20F254CA93FDC72C5C1C8032E20F254CA93FDC72C5C1C8032E20F254CA93FDC72C5C1C8032E20F254CA93FDC72C5C1C8032E20F254CA93FDC72C5C1C8032E20F254CA93FDC72C5C1C8032E20F254CA93FDC72C5C1C8032E20F254CA93FDC72C5C1C8032E20F254CA93FDC72C5C1C8032E20F254CA93FDC72C5C1C8032E20F254CA93FDC72C5C1C8032E20F254CA93FDC72C5C1';
      
      // Correct signature: rsaEncrypt(rsaE, rsaN, data, padding)
      const result = rsaEncrypt(e, n, data);
      // Should return Buffer
      expect(result).toBeInstanceOf(Buffer);
      expect(result.length).toBeGreaterThan(0);
    });

    it('should handle empty data', () => {
      const e = '010001';
      const n = 'C2FC9C5E91C72C5C1C8032E20F254CA93FDC72C5C1C8032E2074CA93FDC72C5C1C8032E20F254CA93FDC72C5C1C8032E20F254CA93FDC72C5C1C8032E20F254CA93FDC72C5C1C8032E20F254CA93FDC72C5C1C8032E20F254CA93FDC72C5C1C8032E20F254CA93FDC72C5C1C8032E20F254CA93FDC72C5C1C8032E20F254CA93FDC72C5C1C8032E20F254CA93FDC72C5C1C8032E20F254CA93FDC72C5C1C8032E20F254CA93FDC72C5C1C8032E20F254CA93FDC72C5C1C8032E20F254CA93FDC72C5C1C8032E20F254CA93FDC72C5C1';
      
      const result = rsaEncrypt(e, n, Buffer.from('', 'utf-8'));
      expect(result).toBeInstanceOf(Buffer);
    });
  });
});

/**
 * Unit tests for XML parser
 */

import { describe, it, expect } from 'vitest';
import { objectToXml, xmlToObject, createRequestXml, parseResponseXml } from '../src/core/xml-parser';

describe('XML Parser', () => {
  describe('objectToXml', () => {
    it('should convert simple object to XML', async () => {
      const obj = { username: 'admin', password: 'admin' };
      const xml = await objectToXml(obj);
      
      expect(xml).toContain('<username>admin</username>');
      expect(xml).toContain('<password>admin</password>');
    });

    it('should convert nested object to XML', async () => {
      const obj = {
        request: {
          username: 'admin',
          password: 'admin'
        }
      };
      const xml = await objectToXml(obj);
      
      expect(xml).toContain('<request>');
      expect(xml).toContain('<username>admin</username>');
      expect(xml).toContain('</request>');
    });

    it('should handle empty object', async () => {
      const xml = await objectToXml({});
      expect(xml).toBeTruthy();
    });
  });

  describe('xmlToObject', () => {
    it('should parse simple XML', async () => {
      const xml = '<response><code>0</code><message>OK</message></response>';
      const obj = await xmlToObject(xml);
      
      expect(obj).toHaveProperty('response');
      expect(obj.response).toHaveProperty('code');
      expect(obj.response).toHaveProperty('message');
    });

    it('should parse XML with attributes', async () => {
      const xml = '<response status="ok"><data>test</data></response>';
      const obj = await xmlToObject(xml);
      
      expect(obj).toHaveProperty('response');
    });

    it('should handle invalid XML gracefully', async () => {
      await expect(xmlToObject('not xml')).rejects.toThrow();
    });
  });

  describe('createRequestXml', () => {
    it('should wrap object in request tag', async () => {
      const obj = { username: 'admin' };
      const xml = await createRequestXml(obj);
      
      expect(xml).toContain('<request>');
      expect(xml).toContain('<username>admin</username>');
      expect(xml).toContain('</request>');
    });

    it('should handle empty object', async () => {
      const xml = await createRequestXml({});
      expect(xml).toContain('<request>');
      expect(xml).toContain('</request>');
    });
  });

  describe('parseResponseXml', () => {
    it('should parse response XML', async () => {
      const xml = '<?xml version="1.0"?><response><DeviceName>E5577</DeviceName></response>';
      const obj = await parseResponseXml(xml);
      
      expect(obj).toHaveProperty('response');
    });

    it('should return empty object for empty XML', async () => {
      const obj = await parseResponseXml('');
      expect(obj).toEqual({});
    });

    it('should handle XML declaration', async () => {
      const xml = '<?xml version="1.0" encoding="UTF-8"?><response><data>test</data></response>';
      const obj = await parseResponseXml(xml);
      
      expect(obj).toHaveProperty('response');
    });
  });
});

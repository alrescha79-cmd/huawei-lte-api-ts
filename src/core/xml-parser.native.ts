/**
 * XML parsing utilities for React Native
 * Uses fast-xml-parser instead of xml2js (which requires Node.js modules)
 */

import { XMLParser, XMLBuilder } from 'fast-xml-parser';

export interface XmlBuilderOptions {
  renderOpts?: {
    pretty?: boolean;
    indent?: string;
    newline?: string;
    allowEmpty?: boolean;
  };
  rootName?: string;
  headless?: boolean;
  xmldec?: {
    version: string;
    encoding?: string;
    standalone?: boolean;
  };
}

export interface XmlParserOptions {
  explicitArray?: boolean;
  ignoreAttrs?: boolean;
  mergeAttrs?: boolean;
}

/**
 * Convert object to XML string
 */
export function objectToXml(data: Record<string, unknown>, options?: XmlBuilderOptions): string {
  const builder = new XMLBuilder({
    ignoreAttributes: false,
    format: options?.renderOpts?.pretty ?? false,
    indentBy: options?.renderOpts?.indent ?? ' ',
    suppressEmptyNode: !(options?.renderOpts?.allowEmpty ?? true),
    suppressBooleanAttributes: false,
  });

  const xml = builder.build(data);
  
  // Add XML declaration if not headless
  if (!options?.headless && options?.xmldec) {
    const version = options.xmldec.version || '1.0';
    const encoding = options.xmldec.encoding || 'UTF-8';
    const standalone = options.xmldec.standalone ? ' standalone="yes"' : '';
    return `<?xml version="${version}" encoding="${encoding}"${standalone}?>\n${xml}`;
  }
  
  return xml;
}

/**
 * Convert object to XML request format
 */
export function createRequestXml(data: Record<string, unknown>): string {
  return objectToXml({ request: data });
}

/**
 * Parse XML string to object
 */
export async function xmlToObject(xml: string, options?: XmlParserOptions): Promise<unknown> {
  const parser = new XMLParser({
    ignoreAttributes: options?.ignoreAttrs ?? true,
    parseAttributeValue: false,
    parseTagValue: true,
    trimValues: true,
    isArray: () => options?.explicitArray ?? false,
  });

  try {
    return parser.parse(xml);
  } catch (error) {
    throw new Error(`Failed to parse XML: ${error}`);
  }
}

/**
 * Parse response XML and extract response/error data
 */
export async function parseResponseXml(xml: string): Promise<Record<string, unknown>> {
  if (!xml || xml.trim() === '') {
    return {};
  }

  try {
    const parsed = await xmlToObject(xml);
    return (parsed || {}) as Record<string, unknown>;
  } catch (error) {
    // If parsing fails, return empty object
    return {};
  }
}

/**
 * XML parsing utilities
 * Provides XML to object and object to XML conversion
 */

import { Builder, Parser } from 'xml2js';

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
  const defaultOptions: XmlBuilderOptions = {
    renderOpts: {
      pretty: false,
      indent: ' ',
      newline: '\n',
      allowEmpty: true,
    },
    headless: true,
  };

  const builder = new Builder({
    ...defaultOptions,
    ...options,
  });

  return builder.buildObject(data);
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
  const defaultOptions: XmlParserOptions = {
    explicitArray: false,
    ignoreAttrs: true,
    mergeAttrs: false,
  };

  const parser = new Parser({
    ...defaultOptions,
    ...options,
  });

  try {
    return await parser.parseStringPromise(xml);
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

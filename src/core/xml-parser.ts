/**
 * XML parsing utilities
 * Provides XML to object and object to XML conversion
 * Auto-detects React Native and uses appropriate XML parser
 */

// Check if running in React Native environment
const isReactNative = typeof navigator !== 'undefined' && navigator.product === 'ReactNative';

// Dynamic imports based on environment
let Builder: any;
let Parser: any;
let XMLBuilder: any;
let XMLParser: any;

if (isReactNative) {
  // React Native: use fast-xml-parser
  try {
    const fastXml = require('fast-xml-parser');
    XMLBuilder = fastXml.XMLBuilder;
    XMLParser = fastXml.XMLParser;
  } catch (e) {
    throw new Error('React Native requires fast-xml-parser. Install: npm install fast-xml-parser');
  }
} else {
  // Node.js: use xml2js
  const xml2js = require('xml2js');
  Builder = xml2js.Builder;
  Parser = xml2js.Parser;
}

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
  if (isReactNative) {
    // Use fast-xml-parser for React Native
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
  } else {
    // Use xml2js for Node.js
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
  if (isReactNative) {
    // Use fast-xml-parser for React Native
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
  } else {
    // Use xml2js for Node.js
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

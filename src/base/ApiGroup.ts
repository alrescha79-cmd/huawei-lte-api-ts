/**
 * Base class for all API groups
 * Provides common methods for making requests
 */

import { Session } from '../core/session';
import { GetResponseType, SetResponseType } from '../types/common';

export class ApiGroup {
  protected session: Session;
  protected apiPrefix: string;

  constructor(session: Session, apiPrefix = 'api') {
    this.session = session;
    this.apiPrefix = apiPrefix;
  }

  /**
   * Build full endpoint path
   */
  protected buildEndpoint(path: string, prefix?: string): string {
    const actualPrefix = prefix || this.apiPrefix;
    // Remove leading slash if present
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    return `/${actualPrefix}/${cleanPath}`;
  }

  /**
   * Perform GET request
   */
  protected async get<T = GetResponseType>(
    endpoint: string,
    _params?: Record<string, unknown>,
    prefix?: string
  ): Promise<T> {
    const fullEndpoint = this.buildEndpoint(endpoint, prefix);
    // Note: params are ignored for now as getWithRetry doesn't support query params
    const response = await this.session.getWithRetry(fullEndpoint);
    return response.data as T;
  }

  /**
   * Perform POST request (returns response data)
   */
  protected async postSet<T = SetResponseType>(
    endpoint: string,
    data: Record<string, unknown> = {},
    prefix?: string
  ): Promise<T> {
    const fullEndpoint = this.buildEndpoint(endpoint, prefix);
    const response = await this.session.postWithRetry(fullEndpoint, data);
    return response.data as T;
  }

  /**
   * Low-level GET without retry (for special cases)
   */
  protected async getRaw<T = Record<string, unknown>>(endpoint: string, prefix?: string): Promise<T> {
    const fullEndpoint = this.buildEndpoint(endpoint, prefix);
    const response = await this.session.get(fullEndpoint);
    return response.data as T;
  }

  /**
   * Low-level POST without retry (for special cases)
   */
  protected async postRaw<T = Record<string, unknown>>(endpoint: string, data: Record<string, unknown> = {}, prefix?: string): Promise<T> {
    const fullEndpoint = this.buildEndpoint(endpoint, prefix);
    const response = await this.session.post(fullEndpoint, data);
    return response.data as T;
  }
}

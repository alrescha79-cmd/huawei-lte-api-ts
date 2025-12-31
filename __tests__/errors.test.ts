/**
 * Unit tests for error classes
 */

import { describe, it, expect } from 'vitest';
import {
  ResponseErrorException,
  ResponseErrorNotSupportedException,
  ResponseErrorLoginRequiredException,
  ResponseErrorSystemBusyException,
  ResponseErrorLoginCsrfException,
  ResponseErrorWrongSessionToken,
  RequestFormatException,
  LoginErrorUsernameWrongException,
  LoginErrorPasswordWrongException,
  LoginErrorUsernamePasswordWrongException,
  LoginErrorUsernamePasswordOverrunException,
  LoginErrorAlreadyLoginException,
  LoginErrorUsernamePasswordModifyException,
} from '../src/core/errors';

describe('Error Classes', () => {
  describe('ResponseErrorException', () => {
    it('should create base error with message and code', () => {
      const error = new ResponseErrorException('Test error', 12345);
      
      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(ResponseErrorException);
      expect(error.message).toBe('Test error');
      expect(error.code).toBe(12345);
      expect(error.name).toBe('ResponseErrorException');
    });

    it('should include error code in toString', () => {
      const error = new ResponseErrorException('Test', 100);
      const str = error.toString();
      
      expect(str).toContain('ResponseErrorException');
      expect(str).toContain('Test');
    });
  });

  describe('Specific Error Classes', () => {
    it('should create ResponseErrorNotSupportedException', () => {
      const error = new ResponseErrorNotSupportedException('Not supported', 100002);
      expect(error).toBeInstanceOf(ResponseErrorException);
      expect(error.name).toBe('ResponseErrorNotSupportedException');
    });

    it('should create ResponseErrorLoginRequiredException', () => {
      const error = new ResponseErrorLoginRequiredException('Login required', 125002);
      expect(error).toBeInstanceOf(ResponseErrorException);
      expect(error.name).toBe('ResponseErrorLoginRequiredException');
    });

    it('should create ResponseErrorSystemBusyException', () => {
      const error = new ResponseErrorSystemBusyException('System busy', 100004);
      expect(error).toBeInstanceOf(ResponseErrorException);
      expect(error.name).toBe('ResponseErrorSystemBusyException');
    });

    it('should create ResponseErrorLoginCsrfException', () => {
      const error = new ResponseErrorLoginCsrfException('CSRF error', 125001);
      expect(error).toBeInstanceOf(ResponseErrorException);
      expect(error.name).toBe('ResponseErrorLoginCsrfException');
    });

    it('should create ResponseErrorWrongSessionToken', () => {
      const error = new ResponseErrorWrongSessionToken('Wrong token', 125003);
      expect(error).toBeInstanceOf(ResponseErrorException);
      expect(error.name).toBe('ResponseErrorWrongSessionToken');
    });

    it('should create RequestFormatException', () => {
      const error = new RequestFormatException('Format error', 100003);
      expect(error).toBeInstanceOf(ResponseErrorException);
      expect(error.name).toBe('RequestFormatException');
    });
  });

  describe('Login Error Classes', () => {
    it('should create LoginErrorUsernameWrongException', () => {
      const error = new LoginErrorUsernameWrongException('Wrong username', 108001);
      expect(error).toBeInstanceOf(ResponseErrorException);
      expect(error.name).toBe('LoginErrorUsernameWrongException');
    });

    it('should create LoginErrorPasswordWrongException', () => {
      const error = new LoginErrorPasswordWrongException('Wrong password', 108002);
      expect(error).toBeInstanceOf(ResponseErrorException);
      expect(error.name).toBe('LoginErrorPasswordWrongException');
    });

    it('should create LoginErrorUsernamePasswordWrongException', () => {
      const error = new LoginErrorUsernamePasswordWrongException('Wrong credentials', 108003);
      expect(error).toBeInstanceOf(ResponseErrorException);
      expect(error.name).toBe('LoginErrorUsernamePasswordWrongException');
    });

    it('should create LoginErrorUsernamePasswordOverrunException', () => {
      const error = new LoginErrorUsernamePasswordOverrunException('Too many attempts', 108007);
      expect(error).toBeInstanceOf(ResponseErrorException);
      expect(error.name).toBe('LoginErrorUsernamePasswordOverrunException');
    });

    it('should create LoginErrorAlreadyLoginException', () => {
      const error = new LoginErrorAlreadyLoginException('Already logged in', 108006);
      expect(error).toBeInstanceOf(ResponseErrorException);
      expect(error.name).toBe('LoginErrorAlreadyLoginException');
    });

    it('should create LoginErrorUsernamePasswordModifyException', () => {
      const error = new LoginErrorUsernamePasswordModifyException('Password change required', 108004);
      expect(error).toBeInstanceOf(ResponseErrorException);
      expect(error.name).toBe('LoginErrorUsernamePasswordModifyException');
    });
  });

  describe('Error Hierarchy', () => {
    it('should maintain proper inheritance chain', () => {
      const error = new ResponseErrorLoginRequiredException('Test', 125002);
      
      expect(error instanceof ResponseErrorLoginRequiredException).toBe(true);
      expect(error instanceof ResponseErrorException).toBe(true);
      expect(error instanceof Error).toBe(true);
    });

    it('should be catchable as base error', () => {
      try {
        throw new ResponseErrorSystemBusyException('Busy', 100004);
      } catch (error) {
        expect(error).toBeInstanceOf(ResponseErrorException);
        expect(error).toBeInstanceOf(ResponseErrorSystemBusyException);
      }
    });
  });
});

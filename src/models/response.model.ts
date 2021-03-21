export interface IResponseHeader {
  [header: string]: string | number | boolean;
}

export interface IResponseBody {
  data: any;
  message: string;
  status?: string;
}

export interface IResponse {
  statusCode: number;
  headers: IResponseHeader;
  body: string;
}

export enum Status {
  SUCCESS = 'Success',
  ERROR = 'unknown error',
  BAD_REQUEST = 'Not found',
}

export enum StatusCode {
  OK = 200,
  ERROR = 500,
  BAD_REQUEST = 400,
}

export const RESPONSE_HEADERS: IResponseHeader = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*', // Required for CORS support to work
  'Access-Control-Allow-Credentials': true, // Required for cookies, authorization headers with HTTPS
};

const STATUS_MESSAGES = {
  [StatusCode.OK]: Status.SUCCESS,
  [StatusCode.BAD_REQUEST]: Status.BAD_REQUEST,
  [StatusCode.ERROR]: Status.ERROR,
};

export default class ResponseModel {
  private body: IResponseBody;

  private code: number;

  /**
   * ResponseModel Constructor
   * @param data
   * @param code
   * @param message
   */
  constructor(data = {}, code = StatusCode.BAD_REQUEST, message = '') {
    this.body = {
      data,
      message,
      status: STATUS_MESSAGES[code],
    };
    this.code = code;
  }

  /**
   * Add or update-task-list a body variable
   * @param variable
   * @param value
   */
  setBodyVariable = (variable: string, value: string): void => {
    this.body[variable] = value;
  };

  /**
   * Set Data
   * @param data
   */
  setData = (data: any): void => {
    this.body.data = data;
  };

  /**
   * Set Status Code
   * @param code
   */
  setCode = (code: number): void => {
    this.code = code;
  };

  /**
   * Get Status Code
   * @return {*}
   */
  getCode = (): number => this.code;

  /**
   * Set message
   * @param message
   */
  setMessage = (message: string): void => {
    this.body.message = message;
  };

  /**
   * Get Message
   * @return {string|*}
   */
  getMessage = (): any => this.body.message;

  /**
   * Generate a response
   * @return {IResponse}
   */
  generate = (): IResponse => ({
    statusCode: this.code,
    headers: RESPONSE_HEADERS,
    body: JSON.stringify(this.body),
  });
}

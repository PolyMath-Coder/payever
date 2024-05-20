export function ErrorResponse(
    httpCode: number,
    msg: string,
    data: object,
    meta: any,
  ) {
    const body = {
      responseCode: httpCode,
      status: false,
      message: msg,
      data: data,
      meta: meta,
    };
  
    return body;
  }
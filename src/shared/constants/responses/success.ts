export function SuccessResponse(
    httpCode: number,
    msg: string,
    data: object,
    meta: any,
  ) {
    const body = {
      responseCode: httpCode,
      status: true,
      message: msg,
      data: data,
      meta: meta,
    };
  
    return body;
  }
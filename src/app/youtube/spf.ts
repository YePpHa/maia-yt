export declare module spf {
  export interface EventDetail {
    url: string | undefined;
    response: SingleResponse | MultipartResponse | undefined;
  }

  export interface SingleResponse {
    attr: {[key: string]: {[key: string]: string}} | undefined;
    body: {[key: string]: string} | undefined;
    cacheKey: string | undefined;
    cacheType: string | undefined;
    data: any | undefined;
    head: string | undefined;
    foot: string | undefined;
    redirect: string | undefined;
    reload: boolean | undefined;
    timing: {[key: string]: number|string|boolean} | undefined;
    title: string | undefined;
    name: string | undefined;
    url: string | undefined;
  }

  export interface MultipartResponse {
    cacheKey: string | undefined;
    cacheType: string | undefined;
    parts: SingleResponse[] | undefined;
    timing: {[key: string]: number} | undefined;
    type: "multipart";
  }
}
declare module '*.css' {
  const content: {
    locals: {[key: string]: string};
    ref: () => void;
    unref: () => void;
    unuse: () => void;
    use: () => void;
  };
  export = content;
}
declare module '*.scss' {
  const content: {
    locals: {[key: string]: string};
    ref: () => void;
    unref: () => void;
    unuse: () => void;
    use: () => void;
  };
  export = content;
}
declare global {
  interface Window {
    twttr: {
      widgets: {
        load: (element?: HTMLElement) => Promise<void>;
      };
    };
  }
}

export {};

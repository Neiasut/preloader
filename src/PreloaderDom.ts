import {
  PreloaderDomAllowStatuses,
  PreloaderDomElements,
  PreloaderDomElementSaveListener,
  PreloaderDomSettings,
  PreloaderDomStatuses
} from './interfaces';
import PreloaderDomThemes from './PreloaderDomThemes';
import {
  addPreloaderDomStylesToPage,
  constructorCanvas,
  defaultConstructorMessageError,
  defaultDestructorMessageError,
  defaultPreloaderDomImage
} from './functions';

const DEFAULT_PATH = 'default';
const CLASSES = {
  root: 'preloader',
  errorWrapper: 'preloader-error',
  actionShow: 'preloader-show',
  actionError: 'preloader-has-error'
};

const themes = new PreloaderDomThemes();
addPreloaderDomStylesToPage();

class PreloaderDom {
  public root: Element;
  public readonly settings: PreloaderDomSettings;
  public configuration: PreloaderDomSettings;
  protected listeners: Map<string, PreloaderDomElementSaveListener> = new Map();

  protected statuses: PreloaderDomStatuses = {
    show: false,
    error: false
  };

  protected elements: PreloaderDomElements = {
    canvas: null,
    errorWrapper: null,
    errorMessage: null
  };

  public static themes: PreloaderDomThemes = themes;
  public static imagePaths: Set<string> = new Set();

  public constructor(element: Element, settings: PreloaderDomSettings) {
    const beforeInstance = element['preloaderDom'];
    if (typeof beforeInstance === 'object' && beforeInstance !== null) {
      return beforeInstance;
    }
    this.settings = settings;
    this.configuration = PreloaderDom.createConfiguration(settings);
    this.root = element;
    this.root.classList.add(CLASSES.root);
  }

  public show(): void {
    if (!this.getStatus('show')) {
      this.elements.canvas = constructorCanvas(this.getPathImage());
      this.elements.errorWrapper = this.elements.canvas.querySelector(
        `.${CLASSES.errorWrapper}`
      );
      this.root.appendChild(this.elements.canvas);
      this.root.classList.add(CLASSES.actionShow);
      this.setStatus('show', true);
      this.runCallback('afterOpenCallback');
    } else {
      if (this.getStatus('error')) {
        this.unError();
      }
    }
  }

  public hide(): void {
    if (this.getStatus('show')) {
      this.runCallback('beforeCloseCallback');
      this.unError();
      this.root.removeChild(this.elements.canvas);
      this.root.classList.remove(CLASSES.actionShow);
      this.setStatus('show', false);
    }
  }

  public error(): void {
    if (!this.getStatus('error')) {
      if (!this.getStatus('show')) {
        this.show();
      }
      const errorMessage = this.configuration.constructorMessageError(this);
      this.elements.errorMessage = errorMessage;
      this.elements.errorWrapper.appendChild(errorMessage);
      this.root.classList.add(CLASSES.actionError);
      this.setStatus('error', true);
    }
  }

  protected unError(): void {
    if (this.getStatus('error')) {
      this.configuration.destructorMessageError(this);
      this.elements.errorWrapper.removeChild(this.elements.errorMessage);
      this.root.classList.remove(CLASSES.actionError);
      this.setStatus('error', false);
    }
  }

  public getStatus(name: PreloaderDomAllowStatuses): boolean {
    if (name in this.statuses) {
      return this.statuses[name];
    }
    throw new Error(`Doesn't have status with name: ${name}`);
  }

  protected setStatus(name: PreloaderDomAllowStatuses, value: boolean): void {
    if (name in this.statuses) {
      this.statuses[name] = value;
      return;
    }
    throw new Error(`Doesn't have status with name: ${name}`);
  }

  public getPathImage(): string {
    const { imgPath } = this.configuration;
    if (imgPath === DEFAULT_PATH) {
      return defaultPreloaderDomImage();
    }
    return imgPath;
  }

  public saveListener(
    key: string,
    eventType: string,
    element: Element,
    callback: () => void,
    addToElement: boolean = true
  ): void {
    if (this.listeners.has(key)) {
      throw new Error(`Callback with key "${key}" already exist`);
    }
    this.listeners.set(key, {
      key,
      eventType,
      callback,
      element
    });
    if (addToElement) {
      element.addEventListener(eventType, callback);
    }
  }

  public getListener(key: string): PreloaderDomElementSaveListener {
    return this.listeners.get(key);
  }

  public removeListenerFromList(key: string): void {
    this.listeners.delete(key);
  }

  public removeListener(key: string, removeFromElement: boolean = true): void {
    const listener = this.getListener(key);
    if (removeFromElement) {
      listener.element.removeEventListener(
        listener.eventType,
        listener.callback
      );
    }
    this.removeListenerFromList(key);
  }

  protected runCallback(name: string): void {
    const callback = this.configuration[name];
    if (typeof callback === 'function') {
      callback(this);
    }
  }

  public static loadImg(url: string): void {
    if (!this.imagePaths.has(url)) {
      const img = new Image();
      img.src = url;
      img.onload = () => {
        img.style.height = '0px';
        img.style.width = '0px';
        document.body.appendChild(img);
        this.imagePaths.add(url);
        setTimeout(() => {
          document.body.removeChild(img);
        }, 100);
      };
      img.onerror = () => {
        new Error(`Could not load image with path: "${url}"`);
      };
    }
  }

  protected static createConfiguration(
    settings: PreloaderDomSettings
  ): PreloaderDomSettings {
    const config = Object.assign({}, this.defaultSettings(), settings);
    const nameTheme = config.theme;
    if (!(typeof nameTheme === 'string')) {
      return config;
    }
    const themeConfig = this.themes.get(nameTheme);
    return Object.assign({}, config, themeConfig);
  }

  public static defaultSettings(): PreloaderDomSettings {
    return {
      constructorMessageError: defaultConstructorMessageError,
      destructorMessageError: defaultDestructorMessageError,
      imgPath: DEFAULT_PATH
    };
  }
}

export default PreloaderDom;

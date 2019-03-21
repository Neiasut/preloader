import PreloaderDom from './PreloaderDom';

export interface PreloaderDomConstructorMessageError {
  (instance: PreloaderDom): Element;
}

export interface PreloaderDomDestructorMessageError {
  (instance: PreloaderDom): void;
}

export interface PreloaderDomAction {
  (instance: PreloaderDom): void;
}

export interface PreloaderDomSettingsBase {
  constructorMessageError?: PreloaderDomConstructorMessageError;
  destructorMessageError?: PreloaderDomDestructorMessageError;
  afterOpenCallback?: PreloaderDomAction;
  beforeCloseCallback?: PreloaderDomAction;
  imgPath?: string;
}

export interface PreloaderDomSettings extends PreloaderDomSettingsBase {
  theme?: string;
}

export interface PreloaderDomStatuses {
  show: boolean;
  error: boolean;
}

export type PreloaderDomAllowStatuses = keyof PreloaderDomStatuses;

export interface PreloaderDomElements {
  canvas: Element;
  errorWrapper: Element;
  errorMessage: Element;
}

export interface PreloaderDomElementSaveListener {
  key: string;
  eventType: string;
  callback: () => void;
  element: Element;
}

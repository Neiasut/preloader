import { PreloaderDomSettingsBase } from './interfaces';

class PreloaderDomThemes {
  protected listThemes: Map<string, PreloaderDomSettingsBase> = new Map();

  public add(name: string, settings: PreloaderDomSettingsBase): void {
    if (this.listThemes.has(name)) {
      throw new Error(`Theme with name: "${name}" already exist!`);
    }
    this.listThemes.set(name, settings);
  }

  public remove(name: string): void {
    this.listThemes.delete(name);
  }

  public get(name): PreloaderDomSettingsBase {
    if (!this.listThemes.has(name)) {
      throw new Error(`Theme with name: "${name}" doesn't exist!`);
    }
    return this.listThemes.get(name);
  }
}

export default PreloaderDomThemes;

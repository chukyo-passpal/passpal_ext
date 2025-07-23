import { URLS } from './constants';

export interface RedirectOptions {
  delay?: number;
  replace?: boolean;
}

export class RedirectManager {
  static redirect(url: string, options: RedirectOptions = {}): void {
    const { delay = 0, replace = false } = options;
    
    if (delay > 0) {
      setTimeout(() => {
        this.performRedirect(url, replace);
      }, delay);
    } else {
      this.performRedirect(url, replace);
    }
  }
  
  private static performRedirect(url: string, replace: boolean): void {
    if (replace) {
      window.location.replace(url);
    } else {
      window.location.href = url;
    }
  }
  
  static redirectToManaboAuth(options?: RedirectOptions): void {
    this.redirect(URLS.MANABO_AUTH, options);
  }
  
  static redirectToAlboLogin(options?: RedirectOptions): void {
    this.redirect(URLS.ALBO_LOGIN, options);
  }
}
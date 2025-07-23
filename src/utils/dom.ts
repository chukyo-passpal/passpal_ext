export class DOMUtils {
  static querySelector<T extends HTMLElement = HTMLElement>(selector: string, parent?: Element | Document): T | null {
    const context = parent || document;
    return context.querySelector(selector) as T | null;
  }
  
  static querySelectorAll<T extends HTMLElement = HTMLElement>(selector: string, parent?: Element | Document): NodeListOf<T> {
    const context = parent || document;
    return context.querySelectorAll(selector) as NodeListOf<T>;
  }
  
  static getElementById<T extends HTMLElement = HTMLElement>(id: string): T | null {
    return document.getElementById(id) as T | null;
  }
  
  static getElementsByTagName<T extends HTMLElement = HTMLElement>(tagName: string): HTMLCollectionOf<T> {
    return document.getElementsByTagName(tagName) as HTMLCollectionOf<T>;
  }
  
  static waitForElement<T extends HTMLElement = HTMLElement>(
    selector: string, 
    timeout: number = 5000,
    parent?: Element | Document
  ): Promise<T> {
    return new Promise((resolve, reject) => {
      const element = this.querySelector<T>(selector, parent);
      if (element) {
        resolve(element);
        return;
      }
      
      const observer = new MutationObserver(() => {
        const element = this.querySelector<T>(selector, parent);
        if (element) {
          observer.disconnect();
          clearTimeout(timeoutId);
          resolve(element);
        }
      });
      
      const timeoutId = setTimeout(() => {
        observer.disconnect();
        reject(new Error(`Element with selector "${selector}" not found within ${timeout}ms`));
      }, timeout);
      
      const context = parent || document;
      observer.observe(context, { 
        childList: true, 
        subtree: true 
      });
    });
  }
  
  static createElement<T extends keyof HTMLElementTagNameMap>(
    tagName: T,
    attributes?: Record<string, string>,
    textContent?: string
  ): HTMLElementTagNameMap[T] {
    const element = document.createElement(tagName);
    
    if (attributes) {
      Object.entries(attributes).forEach(([key, value]) => {
        element.setAttribute(key, value);
      });
    }
    
    if (textContent) {
      element.textContent = textContent;
    }
    
    return element;
  }
  
  static hasTextContent(element: Element, text: string): boolean {
    return element.textContent?.includes(text) ?? false;
  }
  
  static isElementVisible(element: HTMLElement): boolean {
    const style = window.getComputedStyle(element);
    return style.display !== 'none' && 
           style.visibility !== 'hidden' && 
           style.opacity !== '0';
  }
}
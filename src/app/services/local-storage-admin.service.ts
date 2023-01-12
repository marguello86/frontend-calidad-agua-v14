import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export abstract class LocalStorageAdminService {

  constructor() { }

  setLocalStorage(key: string, value: any): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  getLocalStorageItem(key: string): any {
    return localStorage.getItem(key) ? JSON.parse(localStorage.getItem(key)!) : null;
  }

  removeLocalStorageItem(key: string): void {
    localStorage.removeItem(key);
  }

  clearLocalStorage(): void {
    localStorage.clear();
  }
}

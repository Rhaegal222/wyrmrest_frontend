import { Injectable, signal } from '@angular/core';
import { ToastConfig, AlertType } from '../models/component-theme.model';

export interface Toast extends ToastConfig {
  id: string;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toasts = signal<Toast[]>([]);
  
  toasts$ = this.toasts.asReadonly();

  show(config: ToastConfig): void {
    const id = this.generateId();
    const toast: Toast = { ...config, id, duration: config.duration || 3000 };
    
    this.toasts.update(toasts => [...toasts, toast]);

    if (toast.duration && toast.duration > 0) {
      setTimeout(() => this.remove(id), toast.duration);
    }
  }

  success(message: string, duration?: number): void {
    this.show({ message, type: 'success', duration });
  }

  error(message: string, duration?: number): void {
    this.show({ message, type: 'error', duration });
  }

  warning(message: string, duration?: number): void {
    this.show({ message, type: 'warning', duration });
  }

  info(message: string, duration?: number): void {
    this.show({ message, type: 'info', duration });
  }

  remove(id: string): void {
    this.toasts.update(toasts => toasts.filter(t => t.id !== id));
  }

  clear(): void {
    this.toasts.set([]);
  }

  private generateId(): string {
    return 'toast-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
  }
}

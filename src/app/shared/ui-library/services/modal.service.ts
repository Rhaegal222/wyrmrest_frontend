import { Injectable, signal } from '@angular/core';
import { ModalConfig } from '../models/component-theme.model';

export interface ModalInstance {
  id: string;
  config: ModalConfig;
  resolve: (result: boolean) => void;
}

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private modals = signal<ModalInstance[]>([]);
  
  modals$ = this.modals.asReadonly();

  open(config: ModalConfig): Promise<boolean> {
    return new Promise((resolve) => {
      const id = this.generateId();
      const modal: ModalInstance = { id, config, resolve };
      this.modals.update(modals => [...modals, modal]);
    });
  }

  close(id: string, result: boolean): void {
    const modal = this.modals().find(m => m.id === id);
    if (modal) {
      modal.resolve(result);
      this.modals.update(modals => modals.filter(m => m.id !== id));
    }
  }

  closeAll(): void {
    this.modals().forEach(modal => modal.resolve(false));
    this.modals.set([]);
  }

  private generateId(): string {
    return 'modal-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
  }
}

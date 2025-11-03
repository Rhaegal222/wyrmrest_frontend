export type ButtonVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info';
export type ButtonSize = 'small' | 'medium' | 'large';
export type AlertType = 'success' | 'error' | 'warning' | 'info';
export type ToastPosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
export type InputType = 'text' | 'email' | 'number' | 'tel' | 'url';

export interface ComponentTheme {
  primaryColor: string;
  secondaryColor: string;
  successColor: string;
  dangerColor: string;
  warningColor: string;
  infoColor: string;
}

export interface ToastConfig {
  message: string;
  type: AlertType;
  duration?: number;
  position?: ToastPosition;
}

export interface ModalConfig {
  title?: string;
  content?: string;
  confirmText?: string;
  cancelText?: string;
  showCloseButton?: boolean;
}

export interface SelectOption {
  label: string;
  value: any;
  disabled?: boolean;
}

export interface TableColumn {
  field: string;
  header: string;
  sortable?: boolean;
  filterable?: boolean;
}

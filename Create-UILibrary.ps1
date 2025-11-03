# Script: Create-UILibrary-Complete.ps1
# Genera una libreria UI Angular completa e funzionale

param(
    [string]$BasePath = "src/app/shared/ui-library"
)

function Convert-ToPascalCase {
    param([string]$Text)
    ($Text -split '-' | ForEach-Object { $_.Substring(0,1).ToUpper() + $_.Substring(1) }) -join ''
}

# Crea struttura cartelle
$folders = @(
    "$BasePath/components/actions",
    "$BasePath/components/inputs", 
    "$BasePath/components/layout",
    "$BasePath/components/feedback",
    "$BasePath/components/informational",
    "$BasePath/components/structural",
    "$BasePath/directives",
    "$BasePath/pipes",
    "$BasePath/services",
    "$BasePath/models",
    "$BasePath/styles"
)

Write-Host "`n🚀 Creazione UI Library Angular Completa`n" -ForegroundColor Green

foreach ($folder in $folders) {
    New-Item -ItemType Directory -Path $folder -Force | Out-Null
}

# ============================================
# MODELS - Definizioni TypeScript
# ============================================
Write-Host "📦 Creazione Models..." -ForegroundColor Cyan

@"
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
"@ | Out-File "$BasePath/models/component-theme.model.ts" -Encoding UTF8

# ============================================
# SERVICES
# ============================================
Write-Host "🔧 Creazione Services..." -ForegroundColor Cyan

# Theme Service
@"
import { Injectable, signal } from '@angular/core';
import { ComponentTheme } from '../models/component-theme.model';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private currentTheme = signal<ComponentTheme>({
    primaryColor: '#007bff',
    secondaryColor: '#6c757d',
    successColor: '#28a745',
    dangerColor: '#dc3545',
    warningColor: '#ffc107',
    infoColor: '#17a2b8'
  });

  theme = this.currentTheme.asReadonly();

  setTheme(theme: Partial<ComponentTheme>): void {
    this.currentTheme.update(current => ({ ...current, ...theme }));
  }

  resetTheme(): void {
    this.setTheme({
      primaryColor: '#007bff',
      secondaryColor: '#6c757d',
      successColor: '#28a745',
      dangerColor: '#dc3545',
      warningColor: '#ffc107',
      infoColor: '#17a2b8'
    });
  }
}
"@ | Out-File "$BasePath/services/theme.service.ts" -Encoding UTF8

# Toast Service
@"
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

    if (toast.duration > 0) {
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
"@ | Out-File "$BasePath/services/toast.service.ts" -Encoding UTF8

# Modal Service
@"
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
"@ | Out-File "$BasePath/services/modal.service.ts" -Encoding UTF8

# ============================================
# PIPES
# ============================================
Write-Host "🔄 Creazione Pipes..." -ForegroundColor Cyan

@"
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate',
  standalone: true
})
export class TruncatePipe implements PipeTransform {
  transform(value: string, limit: number = 50, ellipsis: string = '...'): string {
    if (!value) return '';
    return value.length > limit ? value.substring(0, limit) + ellipsis : value;
  }
}
"@ | Out-File "$BasePath/pipes/truncate.pipe.ts" -Encoding UTF8

@"
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatDate',
  standalone: true
})
export class FormatDatePipe implements PipeTransform {
  transform(value: Date | string, format: string = 'dd/MM/yyyy'): string {
    if (!value) return '';
    
    const date = typeof value === 'string' ? new Date(value) : value;
    
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return format
      .replace('dd', day)
      .replace('MM', month)
      .replace('yyyy', String(year))
      .replace('HH', hours)
      .replace('mm', minutes);
  }
}
"@ | Out-File "$BasePath/pipes/format-date.pipe.ts" -Encoding UTF8

# ============================================
# DIRECTIVES
# ============================================
Write-Host "✨ Creazione Directives..." -ForegroundColor Cyan

@"
import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[uiRipple]',
  standalone: true
})
export class RippleDirective {
  @Input() rippleColor = 'rgba(255, 255, 255, 0.5)';

  constructor(private el: ElementRef) {
    this.el.nativeElement.style.position = 'relative';
    this.el.nativeElement.style.overflow = 'hidden';
  }

  @HostListener('click', ['`$`event'])
  onClick(event: MouseEvent): void {
    const ripple = document.createElement('span');
    const rect = this.el.nativeElement.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.style.position = 'absolute';
    ripple.style.borderRadius = '50%';
    ripple.style.backgroundColor = this.rippleColor;
    ripple.style.pointerEvents = 'none';
    ripple.style.animation = 'ripple-animation 0.6s ease-out';

    this.el.nativeElement.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  }
}
"@ | Out-File "$BasePath/directives/ripple.directive.ts" -Encoding UTF8

@"
import { Directive, ElementRef, HostListener, Input, OnDestroy } from '@angular/core';

@Directive({
  selector: '[uiTooltip]',
  standalone: true
})
export class TooltipDirective implements OnDestroy {
  @Input('uiTooltip') tooltipText = '';
  @Input() tooltipPosition: 'top' | 'bottom' | 'left' | 'right' = 'top';
  
  private tooltipElement: HTMLElement | null = null;

  constructor(private el: ElementRef) {}

  @HostListener('mouseenter')
  onMouseEnter(): void {
    if (!this.tooltipText) return;
    
    this.tooltipElement = document.createElement('div');
    this.tooltipElement.className = 'ui-tooltip';
    this.tooltipElement.textContent = this.tooltipText;
    document.body.appendChild(this.tooltipElement);

    const hostRect = this.el.nativeElement.getBoundingClientRect();
    const tooltipRect = this.tooltipElement.getBoundingClientRect();

    let top = 0;
    let left = 0;

    switch (this.tooltipPosition) {
      case 'top':
        top = hostRect.top - tooltipRect.height - 8;
        left = hostRect.left + (hostRect.width - tooltipRect.width) / 2;
        break;
      case 'bottom':
        top = hostRect.bottom + 8;
        left = hostRect.left + (hostRect.width - tooltipRect.width) / 2;
        break;
      case 'left':
        top = hostRect.top + (hostRect.height - tooltipRect.height) / 2;
        left = hostRect.left - tooltipRect.width - 8;
        break;
      case 'right':
        top = hostRect.top + (hostRect.height - tooltipRect.height) / 2;
        left = hostRect.right + 8;
        break;
    }

    this.tooltipElement.style.top = top + 'px';
    this.tooltipElement.style.left = left + 'px';
  }

  @HostListener('mouseleave')
  onMouseLeave(): void {
    if (this.tooltipElement) {
      this.tooltipElement.remove();
      this.tooltipElement = null;
    }
  }

  ngOnDestroy(): void {
    if (this.tooltipElement) {
      this.tooltipElement.remove();
    }
  }
}
"@ | Out-File "$BasePath/directives/tooltip.directive.ts" -Encoding UTF8

@"
import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[uiHighlight]',
  standalone: true
})
export class HighlightDirective {
  @Input() highlightColor = '#ffeb3b';
  private originalColor = '';

  constructor(private el: ElementRef) {}

  @HostListener('mouseenter')
  onMouseEnter(): void {
    this.originalColor = this.el.nativeElement.style.backgroundColor;
    this.el.nativeElement.style.backgroundColor = this.highlightColor;
  }

  @HostListener('mouseleave')
  onMouseLeave(): void {
    this.el.nativeElement.style.backgroundColor = this.originalColor;
  }
}
"@ | Out-File "$BasePath/directives/highlight.directive.ts" -Encoding UTF8

Write-Host "⚙️  Creazione Componenti - ACTIONS..." -ForegroundColor Cyan

# ============================================
# BUTTON COMPONENT
# ============================================
New-Item -ItemType Directory -Path "$BasePath/components/actions/button" -Force | Out-Null

@"
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonVariant, ButtonSize } from '../../../models/component-theme.model';
import { RippleDirective } from '../../../directives/ripple.directive';

@Component({
  selector: 'ui-button',
  standalone: true,
  imports: [CommonModule, RippleDirective],
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent {
  @Input() variant: ButtonVariant = 'primary';
  @Input() size: ButtonSize = 'medium';
  @Input() disabled = false;
  @Input() loading = false;
  @Input() fullWidth = false;
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() iconLeft?: string;
  @Input() iconRight?: string;
  
  @Output() clicked = new EventEmitter<MouseEvent>();

  onClickHandler(event: MouseEvent): void {
    if (!this.disabled && !this.loading) {
      this.clicked.emit(event);
    }
  }

  get classes(): string[] {
    return [
      'ui-button',
      'ui-button--' + this.variant,
      'ui-button--' + this.size,
      this.fullWidth ? 'ui-button--full-width' : '',
      this.loading ? 'ui-button--loading' : ''
    ].filter(Boolean);
  }
}
"@ | Out-File "$BasePath/components/actions/button/button.component.ts" -Encoding UTF8

@"
<button
  [type]="type"
  [class]="classes.join(' ')"
  [disabled]="disabled || loading"
  (click)="onClickHandler(`$`event)"
  uiRipple>
  
  @if (loading) {
    <span class="ui-button__spinner"></span>
  }
  
  @if (iconLeft && !loading) {
    <span class="ui-button__icon ui-button__icon--left">{{ iconLeft }}</span>
  }
  
  <span class="ui-button__content">
    <ng-content></ng-content>
  </span>
  
  @if (iconRight && !loading) {
    <span class="ui-button__icon ui-button__icon--right">{{ iconRight }}</span>
  }
</button>
"@ | Out-File "$BasePath/components/actions/button/button.component.html" -Encoding UTF8

@"
.ui-button {
  // Stili verranno generati successivamente
}
"@ | Out-File "$BasePath/components/actions/button/button.component.scss" -Encoding UTF8

Write-Host "  ✓ Button" -ForegroundColor Gray

# ============================================
# LINK COMPONENT
# ============================================
New-Item -ItemType Directory -Path "$BasePath/components/actions/link" -Force | Out-Null

@"
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'ui-link',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './link.component.html',
  styleUrls: ['./link.component.scss']
})
export class LinkComponent {
  @Input() href?: string;
  @Input() routerLink?: string | any[];
  @Input() target: '_blank' | '_self' | '_parent' | '_top' = '_self';
  @Input() underline = true;
  @Input() disabled = false;

  get isExternal(): boolean {
    return !!this.href;
  }
}
"@ | Out-File "$BasePath/components/actions/link/link.component.ts" -Encoding UTF8

@"
@if (isExternal) {
  <a
    [href]="href"
    [target]="target"
    [class.ui-link--underline]="underline"
    [class.ui-link--disabled]="disabled"
    class="ui-link">
    <ng-content></ng-content>
  </a>
} @else {
  <a
    [routerLink]="routerLink"
    [class.ui-link--underline]="underline"
    [class.ui-link--disabled]="disabled"
    class="ui-link">
    <ng-content></ng-content>
  </a>
}
"@ | Out-File "$BasePath/components/actions/link/link.component.html" -Encoding UTF8

@"
.ui-link {
  // Stili verranno generati successivamente
}
"@ | Out-File "$BasePath/components/actions/link/link.component.scss" -Encoding UTF8

Write-Host "  ✓ Link" -ForegroundColor Gray

# ============================================
# ICON BUTTON COMPONENT
# ============================================
New-Item -ItemType Directory -Path "$BasePath/components/actions/icon-button" -Force | Out-Null

@"
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RippleDirective } from '../../../directives/ripple.directive';
import { TooltipDirective } from '../../../directives/tooltip.directive';
import { ButtonVariant, ButtonSize } from '../../../models/component-theme.model';

@Component({
  selector: 'ui-icon-button',
  standalone: true,
  imports: [CommonModule, RippleDirective, TooltipDirective],
  templateUrl: './icon-button.component.html',
  styleUrls: ['./icon-button.component.scss']
})
export class IconButtonComponent {
  @Input() icon!: string;
  @Input() variant: ButtonVariant = 'primary';
  @Input() size: ButtonSize = 'medium';
  @Input() disabled = false;
  @Input() rounded = true;
  @Input() tooltip?: string;
  
  @Output() clicked = new EventEmitter<MouseEvent>();

  onClickHandler(event: MouseEvent): void {
    if (!this.disabled) {
      this.clicked.emit(event);
    }
  }

  get classes(): string[] {
    return [
      'ui-icon-button',
      'ui-icon-button--${this.variant}',
      'ui-icon-button--${this.size}',
      this.rounded ? 'ui-icon-button--rounded' : ''
    ].filter(Boolean);
  }
}
"@ | Out-File "$BasePath/components/actions/icon-button/icon-button.component.ts" -Encoding UTF8

@"
<button
  [class]="classes.join(' ')"
  [disabled]="disabled"
  [uiTooltip]="tooltip || ''"
  (click)="onClickHandler(`$`event)"
  uiRipple>
  <span class="ui-icon-button__icon">{{ icon }}</span>
</button>
"@ | Out-File "$BasePath/components/actions/icon-button/icon-button.component.html" -Encoding UTF8

@"
.ui-icon-button {
  // Stili verranno generati successivamente
}
"@ | Out-File "$BasePath/components/actions/icon-button/icon-button.component.scss" -Encoding UTF8

Write-Host "  ✓ IconButton" -ForegroundColor Gray

# ============================================
# FAB COMPONENT
# ============================================
New-Item -ItemType Directory -Path "$BasePath/components/actions/fab" -Force | Out-Null

@"
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RippleDirective } from '../../../directives/ripple.directive';
import { TooltipDirective } from '../../../directives/tooltip.directive';

@Component({
  selector: 'ui-fab',
  standalone: true,
  imports: [CommonModule, RippleDirective, TooltipDirective],
  templateUrl: './fab.component.html',
  styleUrls: ['./fab.component.scss']
})
export class FabComponent {
  @Input() icon!: string;
  @Input() position: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left' = 'bottom-right';
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Input() tooltip?: string;
  @Input() extended = false;
  
  @Output() clicked = new EventEmitter<MouseEvent>();

  onClickHandler(event: MouseEvent): void {
    this.clicked.emit(event);
  }

  get classes(): string[] {
    return [
      'ui-fab',
      'ui-fab--${this.position}',
      'ui-fab--${this.size}',
      this.extended ? 'ui-fab--extended' : ''
    ].filter(Boolean);
  }
}
"@ | Out-File "$BasePath/components/actions/fab/fab.component.ts" -Encoding UTF8

@"
<button
  [class]="classes.join(' ')"
  [uiTooltip]="tooltip || ''"
  (click)="onClickHandler(`$`event)"
  uiRipple>
  <span class="ui-fab__icon">{{ icon }}</span>
  @if (extended) {
    <span class="ui-fab__label">
      <ng-content></ng-content>
    </span>
  }
</button>
"@ | Out-File "$BasePath/components/actions/fab/fab.component.html" -Encoding UTF8

@"
.ui-fab {
  // Stili verranno generati successivamente
}
"@ | Out-File "$BasePath/components/actions/fab/fab.component.scss" -Encoding UTF8

Write-Host "  ✓ Fab" -ForegroundColor Gray

Write-Host "`n⚙️  Creazione Componenti - INPUTS..." -ForegroundColor Cyan

# ============================================
# TEXT INPUT COMPONENT
# ============================================
New-Item -ItemType Directory -Path "$BasePath/components/inputs/text-input" -Force | Out-Null

@"
import { Component, Input, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { InputType } from '../../../models/component-theme.model';

@Component({
  selector: 'ui-text-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './text-input.component.html',
  styleUrls: ['./text-input.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => TextInputComponent),
    multi: true
  }]
})
export class TextInputComponent implements ControlValueAccessor {
  @Input() label?: string;
  @Input() placeholder = '';
  @Input() type: InputType = 'text';
  @Input() disabled = false;
  @Input() readonly = false;
  @Input() required = false;
  @Input() error?: string;
  @Input() hint?: string;
  @Input() prefixIcon?: string;
  @Input() suffixIcon?: string;

  value = '';
  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(value: string): void {
    this.value = value || '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onInputChange(value: string): void {
    this.value = value;
    this.onChange(value);
  }

  onBlur(): void {
    this.onTouched();
  }

  get hasError(): boolean {
    return !!this.error;
  }
}
"@ | Out-File "$BasePath/components/inputs/text-input/text-input.component.ts" -Encoding UTF8

@"
<div class="ui-text-input" [class.ui-text-input--error]="hasError" [class.ui-text-input--disabled]="disabled">
  @if (label) {
    <label class="ui-text-input__label">
      {{ label }}
      @if (required) {
        <span class="ui-text-input__required">*</span>
      }
    </label>
  }
  
  <div class="ui-text-input__wrapper">
    @if (prefixIcon) {
      <span class="ui-text-input__icon ui-text-input__icon--prefix">{{ prefixIcon }}</span>
    }
    
    <input
      class="ui-text-input__field"
      [type]="type"
      [placeholder]="placeholder"
      [disabled]="disabled"
      [readonly]="readonly"
      [required]="required"
      [value]="value"
      (input)="onInputChange(`$`any(`$`event.target).value)"
      (blur)="onBlur()" />
    
    @if (suffixIcon) {
      <span class="ui-text-input__icon ui-text-input__icon--suffix">{{ suffixIcon }}</span>
    }
  </div>
  
  @if (error) {
    <span class="ui-text-input__error-message">{{ error }}</span>
  } @else if (hint) {
    <span class="ui-text-input__hint">{{ hint }}</span>
  }
</div>
"@ | Out-File "$BasePath/components/inputs/text-input/text-input.component.html" -Encoding UTF8

@"
.ui-text-input {
  // Stili verranno generati successivamente
}
"@ | Out-File "$BasePath/components/inputs/text-input/text-input.component.scss" -Encoding UTF8

Write-Host "  ✓ TextInput" -ForegroundColor Gray

# ============================================
# CHECKBOX COMPONENT
# ============================================
New-Item -ItemType Directory -Path "$BasePath/components/inputs/checkbox" -Force | Out-Null

@"
import { Component, Input, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'ui-checkbox',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => CheckboxComponent),
    multi: true
  }]
})
export class CheckboxComponent implements ControlValueAccessor {
  @Input() label?: string;
  @Input() disabled = false;
  @Input() indeterminate = false;

  checked = false;
  private onChange: (value: boolean) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(value: boolean): void {
    this.checked = value || false;
  }

  registerOnChange(fn: (value: boolean) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  toggle(): void {
    if (!this.disabled) {
      this.checked = !this.checked;
      this.onChange(this.checked);
      this.onTouched();
    }
  }
}
"@ | Out-File "$BasePath/components/inputs/checkbox/checkbox.component.ts" -Encoding UTF8

@"
<label class="ui-checkbox" [class.ui-checkbox--disabled]="disabled">
  <input
    type="checkbox"
    class="ui-checkbox__input"
    [checked]="checked"
    [disabled]="disabled"
    [indeterminate]="indeterminate"
    (change)="toggle()" />
  <span class="ui-checkbox__box">
    <span class="ui-checkbox__checkmark"></span>
  </span>
  @if (label) {
    <span class="ui-checkbox__label">{{ label }}</span>
  }
</label>
"@ | Out-File "$BasePath/components/inputs/checkbox/checkbox.component.html" -Encoding UTF8

@"
.ui-checkbox {
  // Stili verranno generati successivamente
}
"@ | Out-File "$BasePath/components/inputs/checkbox/checkbox.component.scss" -Encoding UTF8

Write-Host "  ✓ Checkbox" -ForegroundColor Gray

# ============================================
# TOGGLE COMPONENT
# ============================================
New-Item -ItemType Directory -Path "$BasePath/components/inputs/toggle" -Force | Out-Null

@"
import { Component, Input, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'ui-toggle',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './toggle.component.html',
  styleUrls: ['./toggle.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => ToggleComponent),
    multi: true
  }]
})
export class ToggleComponent implements ControlValueAccessor {
  @Input() label?: string;
  @Input() disabled = false;
  @Input() size: 'small' | 'medium' | 'large' = 'medium';

  checked = false;
  private onChange: (value: boolean) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(value: boolean): void {
    this.checked = value || false;
  }

  registerOnChange(fn: (value: boolean) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  toggle(): void {
    if (!this.disabled) {
      this.checked = !this.checked;
      this.onChange(this.checked);
      this.onTouched();
    }
  }

  get classes(): string[] {
    return [
      'ui-toggle',
      'ui-toggle--${this.size}',
      this.disabled ? 'ui-toggle--disabled' : '',
      this.checked ? 'ui-toggle--checked' : ''
    ].filter(Boolean);
  }
}
"@ | Out-File "$BasePath/components/inputs/toggle/toggle.component.ts" -Encoding UTF8

@"
<label [class]="classes.join(' ')">
  <input
    type="checkbox"
    class="ui-toggle__input"
    [checked]="checked"
    [disabled]="disabled"
    (change)="toggle()" />
  <span class="ui-toggle__track">
    <span class="ui-toggle__thumb"></span>
  </span>
  @if (label) {
    <span class="ui-toggle__label">{{ label }}</span>
  }
</label>
"@ | Out-File "$BasePath/components/inputs/toggle/toggle.component.html" -Encoding UTF8

@"
.ui-toggle {
  // Stili verranno generati successivamente
}
"@ | Out-File "$BasePath/components/inputs/toggle/toggle.component.scss" -Encoding UTF8

Write-Host "  ✓ Toggle" -ForegroundColor Gray

# ============================================
# SELECT COMPONENT
# ============================================
New-Item -ItemType Directory -Path "$BasePath/components/inputs/select" -Force | Out-Null

@"
import { Component, Input, forwardRef, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { SelectOption } from '../../../models/component-theme.model';

@Component({
  selector: 'ui-select',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => SelectComponent),
    multi: true
  }]
})
export class SelectComponent implements ControlValueAccessor {
  @Input() label?: string;
  @Input() placeholder = 'Seleziona...';
  @Input() options: SelectOption[] = [];
  @Input() disabled = false;
  @Input() required = false;
  @Input() error?: string;

  value: any = null;
  isOpen = signal(false);
  
  private onChange: (value: any) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(value: any): void {
    this.value = value;
  }

  registerOnChange(fn: (value: any) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  toggleDropdown(): void {
    if (!this.disabled) {
      this.isOpen.update(v => !v);
    }
  }

  selectOption(option: SelectOption): void {
    if (!option.disabled) {
      this.value = option.value;
      this.onChange(this.value);
      this.onTouched();
      this.isOpen.set(false);
    }
  }

  getSelectedLabel(): string {
    const selected = this.options.find(opt => opt.value === this.value);
    return selected ? selected.label : this.placeholder;
  }
}
"@ | Out-File "$BasePath/components/inputs/select/select.component.ts" -Encoding UTF8

@"
<div class="ui-select" [class.ui-select--disabled]="disabled" [class.ui-select--error]="error">
  @if (label) {
    <label class="ui-select__label">
      {{ label }}
      @if (required) {
        <span class="ui-select__required">*</span>
      }
    </label>
  }
  
  <div class="ui-select__control" (click)="toggleDropdown()">
    <span class="ui-select__value">{{ getSelectedLabel() }}</span>
    <span class="ui-select__arrow" [class.ui-select__arrow--open]="isOpen()">▼</span>
  </div>
  
  @if (isOpen()) {
    <div class="ui-select__dropdown">
      @for (option of options; track option.value) {
        <div
          class="ui-select__option"
          [class.ui-select__option--selected]="option.value === value"
          [class.ui-select__option--disabled]="option.disabled"
          (click)="selectOption(option)">
          {{ option.label }}
        </div>
      }
    </div>
  }
  
  @if (error) {
    <span class="ui-select__error-message">{{ error }}</span>
  }
</div>
"@ | Out-File "$BasePath/components/inputs/select/select.component.html" -Encoding UTF8

@"
.ui-select {
  // Stili verranno generati successivamente
}
"@ | Out-File "$BasePath/components/inputs/select/select.component.scss" -Encoding UTF8

Write-Host "  ✓ Select" -ForegroundColor Gray

Write-Host "`n⚙️  Creazione Componenti - LAYOUT..." -ForegroundColor Cyan

# ============================================
# CARD COMPONENT
# ============================================
New-Item -ItemType Directory -Path "$BasePath/components/layout/card" -Force | Out-Null

@"
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ui-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent {
  @Input() title?: string;
  @Input() subtitle?: string;
  @Input() elevation: 0 | 1 | 2 | 3 = 1;
  @Input() padding: 'none' | 'small' | 'medium' | 'large' = 'medium';
  @Input() hoverable = false;

  get classes(): string[] {
    return [
      'ui-card',
      'ui-card--elevation-${this.elevation}',
      'ui-card--padding-${this.padding}',
      this.hoverable ? 'ui-card--hoverable' : ''
    ].filter(Boolean);
  }
}
"@ | Out-File "$BasePath/components/layout/card/card.component.ts" -Encoding UTF8

@"
<div [class]="classes.join(' ')">
  @if (title || subtitle) {
    <div class="ui-card__header">
      @if (title) {
        <h3 class="ui-card__title">{{ title }}</h3>
      }
      @if (subtitle) {
        <p class="ui-card__subtitle">{{ subtitle }}</p>
      }
    </div>
  }
  
  <div class="ui-card__content">
    <ng-content></ng-content>
  </div>
  
  <ng-content select="[footer]"></ng-content>
</div>
"@ | Out-File "$BasePath/components/layout/card/card.component.html" -Encoding UTF8

@"
.ui-card {
  // Stili verranno generati successivamente
}
"@ | Out-File "$BasePath/components/layout/card/card.component.scss" -Encoding UTF8

Write-Host "  ✓ Card" -ForegroundColor Gray

# ============================================
# CONTAINER COMPONENT
# ============================================
New-Item -ItemType Directory -Path "$BasePath/components/layout/container" -Force | Out-Null

@"
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ui-container',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.scss']
})
export class ContainerComponent {
  @Input() maxWidth: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full' = 'lg';
  @Input() padding = true;

  get classes(): string[] {
    return [
      'ui-container',
      'ui-container--${this.maxWidth}',
      this.padding ? 'ui-container--padded' : ''
    ].filter(Boolean);
  }
}
"@ | Out-File "$BasePath/components/layout/container/container.component.ts" -Encoding UTF8

@"
<div [class]="classes.join(' ')">
  <ng-content></ng-content>
</div>
"@ | Out-File "$BasePath/components/layout/container/container.component.html" -Encoding UTF8

@"
.ui-container {
  // Stili verranno generati successivamente
}
"@ | Out-File "$BasePath/components/layout/container/container.component.scss" -Encoding UTF8

Write-Host "  ✓ Container" -ForegroundColor Gray

# ============================================
# DIVIDER COMPONENT
# ============================================
New-Item -ItemType Directory -Path "$BasePath/components/layout/divider" -Force | Out-Null

@"
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ui-divider',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './divider.component.html',
  styleUrls: ['./divider.component.scss']
})
export class DividerComponent {
  @Input() orientation: 'horizontal' | 'vertical' = 'horizontal';
  @Input() spacing: 'small' | 'medium' | 'large' = 'medium';
  @Input() text?: string;

  get classes(): string[] {
    return [
      'ui-divider',
      'ui-divider--${this.orientation}',
      'ui-divider--spacing-${this.spacing}',
      this.text ? 'ui-divider--with-text' : ''
    ].filter(Boolean);
  }
}
"@ | Out-File "$BasePath/components/layout/divider/divider.component.ts" -Encoding UTF8

@"
<div [class]="classes.join(' ')">
  @if (text) {
    <span class="ui-divider__text">{{ text }}</span>
  }
</div>
"@ | Out-File "$BasePath/components/layout/divider/divider.component.html" -Encoding UTF8

@"
.ui-divider {
  // Stili verranno generati successivamente
}
"@ | Out-File "$BasePath/components/layout/divider/divider.component.scss" -Encoding UTF8

Write-Host "  ✓ Divider" -ForegroundColor Gray

Write-Host "`n⚙️  Creazione Componenti - FEEDBACK..." -ForegroundColor Cyan

# ============================================
# ALERT COMPONENT
# ============================================
New-Item -ItemType Directory -Path "$BasePath/components/feedback/alert" -Force | Out-Null

@"
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertType } from '../../../models/component-theme.model';

@Component({
  selector: 'ui-alert',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent {
  @Input() type: AlertType = 'info';
  @Input() title?: string;
  @Input() closeable = false;
  @Input() icon?: string;
  
  @Output() closed = new EventEmitter<void>();

  get defaultIcon(): string {
    const icons: Record<AlertType, string> = {
      success: '✓',
      error: '✕',
      warning: '⚠',
      info: 'ℹ'
    };
    return this.icon || icons[this.type];
  }

  close(): void {
    this.closed.emit();
  }

  get classes(): string[] {
    return [
      'ui-alert',
      'ui-alert--${this.type}'
    ];
  }
}
"@ | Out-File "$BasePath/components/feedback/alert/alert.component.ts" -Encoding UTF8

@"
<div [class]="classes.join(' ')">
  <span class="ui-alert__icon">{{ defaultIcon }}</span>
  
  <div class="ui-alert__content">
    @if (title) {
      <strong class="ui-alert__title">{{ title }}</strong>
    }
    <div class="ui-alert__message">
      <ng-content></ng-content>
    </div>
  </div>
  
  @if (closeable) {
    <button class="ui-alert__close" (click)="close()">✕</button>
  }
</div>
"@ | Out-File "$BasePath/components/feedback/alert/alert.component.html" -Encoding UTF8

@"
.ui-alert {
  // Stili verranno generati successivamente
}
"@ | Out-File "$BasePath/components/feedback/alert/alert.component.scss" -Encoding UTF8

Write-Host "  ✓ Alert" -ForegroundColor Gray

# ============================================
# SPINNER COMPONENT
# ============================================
New-Item -ItemType Directory -Path "$BasePath/components/feedback/spinner" -Force | Out-Null

@"
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ui-spinner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss']
})
export class SpinnerComponent {
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Input() color: 'primary' | 'secondary' | 'white' = 'primary';
  @Input() overlay = false;

  get classes(): string[] {
    return [
      'ui-spinner',
      'ui-spinner--${this.size}',
      'ui-spinner--${this.color}',
      this.overlay ? 'ui-spinner--overlay' : ''
    ].filter(Boolean);
  }
}
"@ | Out-File "$BasePath/components/feedback/spinner/spinner.component.ts" -Encoding UTF8

@"
@if (overlay) {
  <div class="ui-spinner-overlay">
    <div [class]="classes.join(' ')">
      <div class="ui-spinner__circle"></div>
    </div>
  </div>
} @else {
  <div [class]="classes.join(' ')">
    <div class="ui-spinner__circle"></div>
  </div>
}
"@ | Out-File "$BasePath/components/feedback/spinner/spinner.component.html" -Encoding UTF8

@"
.ui-spinner {
  // Stili verranno generati successivamente
}
"@ | Out-File "$BasePath/components/feedback/spinner/spinner.component.scss" -Encoding UTF8

Write-Host "  ✓ Spinner" -ForegroundColor Gray

# ============================================
# PROGRESS BAR COMPONENT
# ============================================
New-Item -ItemType Directory -Path "$BasePath/components/feedback/progress-bar" -Force | Out-Null

@"
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ui-progress-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.scss']
})
export class ProgressBarComponent {
  @Input() value = 0;
  @Input() max = 100;
  @Input() showLabel = false;
  @Input() color: 'primary' | 'success' | 'warning' | 'danger' = 'primary';
  @Input() striped = false;
  @Input() animated = false;

  get percentage(): number {
    return Math.min(100, Math.max(0, (this.value / this.max) * 100));
  }

  get barClasses(): string[] {
    return [
      'ui-progress-bar__fill',
      'ui-progress-bar__fill--${this.color}',
      this.striped ? 'ui-progress-bar__fill--striped' : '',
      this.animated ? 'ui-progress-bar__fill--animated' : ''
    ].filter(Boolean);
  }
}
"@ | Out-File "$BasePath/components/feedback/progress-bar/progress-bar.component.ts" -Encoding UTF8

@"
<div class="ui-progress-bar">
  <div class="ui-progress-bar__track">
    <div
      [class]="barClasses.join(' ')"
      [style.width.%]="percentage">
      @if (showLabel) {
        <span class="ui-progress-bar__label">{{ percentage.toFixed(0) }}%</span>
      }
    </div>
  </div>
</div>
"@ | Out-File "$BasePath/components/feedback/progress-bar/progress-bar.component.html" -Encoding UTF8

@"
.ui-progress-bar {
  // Stili verranno generati successivamente
}
"@ | Out-File "$BasePath/components/feedback/progress-bar/progress-bar.component.scss" -Encoding UTF8

Write-Host "  ✓ ProgressBar" -ForegroundColor Gray

# ============================================
# TOAST CONTAINER COMPONENT
# ============================================
New-Item -ItemType Directory -Path "$BasePath/components/feedback/toast-container" -Force | Out-Null

@"
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'ui-toast-container',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast-container.component.html',
  styleUrls: ['./toast-container.component.scss']
})
export class ToastContainerComponent {
  private toastService = inject(ToastService);
  
  toasts = this.toastService.toasts$;

  remove(id: string): void {
    this.toastService.remove(id);
  }

  getIcon(type: string): string {
    const icons: Record<string, string> = {
      success: '✓',
      error: '✕',
      warning: '⚠',
      info: 'ℹ'
    };
    return icons[type] || icons.info;
  }
}
"@ | Out-File "$BasePath/components/feedback/toast-container/toast-container.component.ts" -Encoding UTF8

@"
<div class="ui-toast-container">
  @for (toast of toasts(); track toast.id) {
    <div class="ui-toast ui-toast--{{ toast.type }}" [class.ui-toast--{{ toast.position }}]="toast.position">
      <span class="ui-toast__icon">{{ getIcon(toast.type) }}</span>
      <span class="ui-toast__message">{{ toast.message }}</span>
      <button class="ui-toast__close" (click)="remove(toast.id)">✕</button>
    </div>
  }
</div>
"@ | Out-File "$BasePath/components/feedback/toast-container/toast-container.component.html" -Encoding UTF8

@"
.ui-toast-container {
  // Stili verranno generati successivamente
}
"@ | Out-File "$BasePath/components/feedback/toast-container/toast-container.component.scss" -Encoding UTF8

Write-Host "  ✓ ToastContainer" -ForegroundColor Gray

Write-Host "`n⚙️  Creazione Componenti - INFORMATIONAL..." -ForegroundColor Cyan

# ============================================
# BADGE COMPONENT
# ============================================
New-Item -ItemType Directory -Path "$BasePath/components/informational/badge" -Force | Out-Null

@"
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonVariant } from '../../../models/component-theme.model';

@Component({
  selector: 'ui-badge',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './badge.component.html',
  styleUrls: ['./badge.component.scss']
})
export class BadgeComponent {
  @Input() variant: ButtonVariant = 'primary';
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Input() dot = false;
  @Input() outlined = false;

  get classes(): string[] {
    return [
      'ui-badge',
      'ui-badge--${this.variant}',
      'ui-badge--${this.size}',
      this.dot ? 'ui-badge--dot' : '',
      this.outlined ? 'ui-badge--outlined' : ''
    ].filter(Boolean);
  }
}
"@ | Out-File "$BasePath/components/informational/badge/badge.component.ts" -Encoding UTF8

@"
<span [class]="classes.join(' ')">
  <ng-content></ng-content>
</span>
"@ | Out-File "$BasePath/components/informational/badge/badge.component.html" -Encoding UTF8

@"
.ui-badge {
  // Stili verranno generati successivamente
}
"@ | Out-File "$BasePath/components/informational/badge/badge.component.scss" -Encoding UTF8

Write-Host "  ✓ Badge" -ForegroundColor Gray

# ============================================
# AVATAR COMPONENT
# ============================================
New-Item -ItemType Directory -Path "$BasePath/components/informational/avatar" -Force | Out-Null

@"
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ui-avatar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss']
})
export class AvatarComponent {
  @Input() src?: string;
  @Input() alt = '';
  @Input() initials?: string;
  @Input() size: 'small' | 'medium' | 'large' | 'xlarge' = 'medium';
  @Input() shape: 'circle' | 'square' = 'circle';
  @Input() status?: 'online' | 'offline' | 'away' | 'busy';

  imageError = false;

  onImageError(): void {
    this.imageError = true;
  }

  get displayInitials(): string {
    if (this.initials) return this.initials;
    if (this.alt) {
      return this.alt
        .split(' ')
        .map(word => word[0])
        .join('')
        .substring(0, 2)
        .toUpperCase();
    }
    return '?';
  }

  get classes(): string[] {
    return [
      'ui-avatar',
      'ui-avatar--${this.size}',
      'ui-avatar--${this.shape}',
      this.status ? 'ui-avatar--with-status' : ''
    ].filter(Boolean);
  }
}
"@ | Out-File "$BasePath/components/informational/avatar/avatar.component.ts" -Encoding UTF8

@"
<div [class]="classes.join(' ')">
  @if (src && !imageError) {
    <img
      [src]="src"
      [alt]="alt"
      class="ui-avatar__image"
      (error)="onImageError()" />
  } @else {
    <span class="ui-avatar__initials">{{ displayInitials }}</span>
  }
  
  @if (status) {
    <span class="ui-avatar__status ui-avatar__status--{{ status }}"></span>
  }
</div>
"@ | Out-File "$BasePath/components/informational/avatar/avatar.component.html" -Encoding UTF8

@"
.ui-avatar {
  // Stili verranno generati successivamente
}
"@ | Out-File "$BasePath/components/informational/avatar/avatar.component.scss" -Encoding UTF8

Write-Host "  ✓ Avatar" -ForegroundColor Gray

# ============================================
# TABLE COMPONENT
# ============================================
New-Item -ItemType Directory -Path "$BasePath/components/informational/table" -Force | Out-Null

@"
import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableColumn } from '../../../models/component-theme.model';

@Component({
  selector: 'ui-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent {
  @Input() columns: TableColumn[] = [];
  @Input() data: any[] = [];
  @Input() striped = false;
  @Input() hoverable = true;
  @Input() bordered = false;
  
  @Output() rowClick = new EventEmitter<any>();

  sortColumn = signal<string | null>(null);
  sortDirection = signal<'asc' | 'desc'>('asc');

  onSort(column: TableColumn): void {
    if (!column.sortable) return;

    if (this.sortColumn() === column.field) {
      this.sortDirection.update(dir => dir === 'asc' ? 'desc' : 'asc');
    } else {
      this.sortColumn.set(column.field);
      this.sortDirection.set('asc');
    }
  }

  getSortedData(): any[] {
    const col = this.sortColumn();
    if (!col) return this.data;

    return [...this.data].sort((a, b) => {
      const aVal = a[col];
      const bVal = b[col];
      const modifier = this.sortDirection() === 'asc' ? 1 : -1;

      if (aVal < bVal) return -1 * modifier;
      if (aVal > bVal) return 1 * modifier;
      return 0;
    });
  }

  onRowClick(row: any): void {
    this.rowClick.emit(row);
  }

  get tableClasses(): string[] {
    return [
      'ui-table',
      this.striped ? 'ui-table--striped' : '',
      this.hoverable ? 'ui-table--hoverable' : '',
      this.bordered ? 'ui-table--bordered' : ''
    ].filter(Boolean);
  }
}
"@ | Out-File "$BasePath/components/informational/table/table.component.ts" -Encoding UTF8

@"
<div class="ui-table-wrapper">
  <table [class]="tableClasses.join(' ')">
    <thead class="ui-table__head">
      <tr>
        @for (column of columns; track column.field) {
          <th
            class="ui-table__header-cell"
            [class.ui-table__header-cell--sortable]="column.sortable"
            (click)="onSort(column)">
            {{ column.header }}
            @if (column.sortable && sortColumn() === column.field) {
              <span class="ui-table__sort-icon">
                {{ sortDirection() === 'asc' ? '▲' : '▼' }}
              </span>
            }
          </th>
        }
      </tr>
    </thead>
    <tbody class="ui-table__body">
      @for (row of getSortedData(); track row) {
        <tr class="ui-table__row" (click)="onRowClick(row)">
          @for (column of columns; track column.field) {
            <td class="ui-table__cell">{{ row[column.field] }}</td>
          }
        </tr>
      }
      @empty {
        <tr>
          <td [attr.colspan]="columns.length" class="ui-table__empty">
            Nessun dato disponibile
          </td>
        </tr>
      }
    </tbody>
  </table>
</div>
"@ | Out-File "$BasePath/components/informational/table/table.component.html" -Encoding UTF8

@"
.ui-table {
  // Stili verranno generati successivamente
}
"@ | Out-File "$BasePath/components/informational/table/table.component.scss" -Encoding UTF8

Write-Host "  ✓ Table" -ForegroundColor Gray

# ============================================
# MODULE PRINCIPALE
# ============================================
Write-Host "`n📚 Creazione modulo principale..." -ForegroundColor Cyan

@"
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Actions
import { ButtonComponent } from './components/actions/button/button.component';
import { LinkComponent } from './components/actions/link/link.component';
import { IconButtonComponent } from './components/actions/icon-button/icon-button.component';
import { FabComponent } from './components/actions/fab/fab.component';

// Inputs
import { TextInputComponent } from './components/inputs/text-input/text-input.component';
import { CheckboxComponent } from './components/inputs/checkbox/checkbox.component';
import { ToggleComponent } from './components/inputs/toggle/toggle.component';
import { SelectComponent } from './components/inputs/select/select.component';

// Layout
import { CardComponent } from './components/layout/card/card.component';
import { ContainerComponent } from './components/layout/container/container.component';
import { DividerComponent } from './components/layout/divider/divider.component';

// Feedback
import { AlertComponent } from './components/feedback/alert/alert.component';
import { SpinnerComponent } from './components/feedback/spinner/spinner.component';
import { ProgressBarComponent } from './components/feedback/progress-bar/progress-bar.component';
import { ToastContainerComponent } from './components/feedback/toast-container/toast-container.component';

// Informational
import { BadgeComponent } from './components/informational/badge/badge.component';
import { AvatarComponent } from './components/informational/avatar/avatar.component';
import { TableComponent } from './components/informational/table/table.component';

// Directives
import { RippleDirective } from './directives/ripple.directive';
import { TooltipDirective } from './directives/tooltip.directive';
import { HighlightDirective } from './directives/highlight.directive';

// Pipes
import { TruncatePipe } from './pipes/truncate.pipe';
import { FormatDatePipe } from './pipes/format-date.pipe';

const COMPONENTS = [
  // Actions
  ButtonComponent,
  LinkComponent,
  IconButtonComponent,
  FabComponent,
  // Inputs
  TextInputComponent,
  CheckboxComponent,
  ToggleComponent,
  SelectComponent,
  // Layout
  CardComponent,
  ContainerComponent,
  DividerComponent,
  // Feedback
  AlertComponent,
  SpinnerComponent,
  ProgressBarComponent,
  ToastContainerComponent,
  // Informational
  BadgeComponent,
  AvatarComponent,
  TableComponent
];

const DIRECTIVES = [
  RippleDirective,
  TooltipDirective,
  HighlightDirective
];

const PIPES = [
  TruncatePipe,
  FormatDatePipe
];

@NgModule({
  imports: [
    CommonModule,
    ...COMPONENTS,
    ...DIRECTIVES,
    ...PIPES
  ],
  exports: [
    ...COMPONENTS,
    ...DIRECTIVES,
    ...PIPES
  ]
})
export class UiLibraryModule { }
"@ | Out-File "$BasePath/ui-library.module.ts" -Encoding UTF8

# ============================================
# PUBLIC API (per export semplificato)
# ============================================
@"
// Models
export * from './models/component-theme.model';

// Services
export * from './services/theme.service';
export * from './services/toast.service';
export * from './services/modal.service';

// Components - Actions
export * from './components/actions/button/button.component';
export * from './components/actions/link/link.component';
export * from './components/actions/icon-button/icon-button.component';
export * from './components/actions/fab/fab.component';

// Components - Inputs
export * from './components/inputs/text-input/text-input.component';
export * from './components/inputs/checkbox/checkbox.component';
export * from './components/inputs/toggle/toggle.component';
export * from './components/inputs/select/select.component';

// Components - Layout
export * from './components/layout/card/card.component';
export * from './components/layout/container/container.component';
export * from './components/layout/divider/divider.component';

// Components - Feedback
export * from './components/feedback/alert/alert.component';
export * from './components/feedback/spinner/spinner.component';
export * from './components/feedback/progress-bar/progress-bar.component';
export * from './components/feedback/toast-container/toast-container.component';

// Components - Informational
export * from './components/informational/badge/badge.component';
export * from './components/informational/avatar/avatar.component';
export * from './components/informational/table/table.component';

// Directives
export * from './directives/ripple.directive';
export * from './directives/tooltip.directive';
export * from './directives/highlight.directive';

// Pipes
export * from './pipes/truncate.pipe';
export * from './pipes/format-date.pipe';

// Module
export * from './ui-library.module';
"@ | Out-File "$BasePath/public-api.ts" -Encoding UTF8

# ============================================
# STYLES BASE
# ============================================
Write-Host "`n🎨 Creazione file stili base..." -ForegroundColor Cyan

@"
// Variabili globali
`$primary-color: #007bff;
`$secondary-color: #6c757d;
`$success-color: #28a745;
`$danger-color: #dc3545;
`$warning-color: #ffc107;
`$info-color: #17a2b8;

`$text-color: #212529;
`$text-muted: #6c757d;
`$border-color: #dee2e6;
`$background-color: #ffffff;

`$spacing-xs: 4px;
`$spacing-sm: 8px;
`$spacing-md: 16px;
`$spacing-lg: 24px;
`$spacing-xl: 32px;

`$border-radius-sm: 4px;
`$border-radius-md: 8px;
`$border-radius-lg: 12px;
`$border-radius-full: 9999px;

`$shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
`$shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
`$shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);

`$font-size-sm: 0.875rem;
`$font-size-base: 1rem;
`$font-size-lg: 1.125rem;
`$font-size-xl: 1.25rem;

`$transition-fast: 150ms;
`$transition-base: 200ms;
`$transition-slow: 300ms;
"@ | Out-File "$BasePath/styles/_variables.scss" -Encoding UTF8

@"
// Mixins utili
@mixin flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}

@mixin flex-between {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

@mixin truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

@mixin focus-ring {
  outline: 2px solid `$primary-color;
  outline-offset: 2px;
}
"@ | Out-File "$BasePath/styles/_mixins.scss" -Encoding UTF8

@"
// Animazioni globali
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideIn {
  from {
    transform: translateY(-10px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@keyframes ripple-animation {
  to {
    transform: scale(4);
    opacity: 0;
  }
}
"@ | Out-File "$BasePath/styles/_animations.scss" -Encoding UTF8

@"
// Tema principale
@import 'variables';
@import 'mixins';
@import 'animations';

// Reset e base
* {
  box-sizing: border-box;
}

// Utilities
.ui-sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

// Tooltip globale
.ui-tooltip {
  position: fixed;
  z-index: 9999;
  background-color: rgba(0, 0, 0, 0.9);
  color: white;
  padding: 6px 12px;
  border-radius: `$border-radius-sm;
  font-size: `$font-size-sm;
  pointer-events: none;
  animation: fadeIn `$transition-fast ease-out;
}
"@ | Out-File "$BasePath/styles/theme.scss" -Encoding UTF8

Write-Host "`n✅ UI Library creata con successo!" -ForegroundColor Green
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Green
Write-Host "📍 Percorso: $BasePath" -ForegroundColor Cyan
Write-Host "`n📦 Componenti creati:" -ForegroundColor Yellow
Write-Host "  • 17 Componenti UI completi e funzionali" -ForegroundColor White
Write-Host "  • 3 Servizi (Theme, Toast, Modal)" -ForegroundColor White
Write-Host "  • 3 Direttive (Ripple, Tooltip, Highlight)" -ForegroundColor White
Write-Host "  • 2 Pipes (Truncate, FormatDate)" -ForegroundColor White
Write-Host "  • Models e tipizzazioni TypeScript" -ForegroundColor White
Write-Host "  • Modulo Angular con exports" -ForegroundColor White
Write-Host "`n📝 Prossimi passi:" -ForegroundColor Yellow
Write-Host "  1. Importa UiLibraryModule nel tuo AppModule" -ForegroundColor White
Write-Host "  2. Genera gli stili SCSS per ogni componente" -ForegroundColor White
Write-Host "  3. Testa i componenti nell'applicazione" -ForegroundColor White
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`n" -ForegroundColor Green

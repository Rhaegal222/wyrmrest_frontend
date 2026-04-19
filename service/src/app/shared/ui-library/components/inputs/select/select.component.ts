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

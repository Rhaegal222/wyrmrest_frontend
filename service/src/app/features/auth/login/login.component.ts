import { Component, OnInit, effect, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../shared/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly redirectEffect = effect(() => {
    if (this.auth.isAuthenticated()) {
      void this.router.navigateByUrl('/');
    }
  });

  readonly loading = this.auth.loading;
  readonly error = this.auth.error;
  readonly twoFactorRequired = this.auth.twoFactorRequired;

  readonly form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    remember: [true],
    code: [''],
  });

  ngOnInit(): void {
    this.auth.initialize();
  }

  submit(): void {
    if (this.loading()) {
      return;
    }

    if (this.twoFactorRequired()) {
      const token = this.auth.pendingTwoFactorToken();
      const code = this.form.controls.code.value?.trim() ?? '';

      if (!token || !code) {
        return;
      }

      this.auth.verifyTwoFactor(token, code).subscribe({
        next: () => void this.router.navigateByUrl('/'),
        error: () => void 0,
      });

      return;
    }

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload = {
      email: this.form.controls.email.value?.trim() ?? '',
      password: this.form.controls.password.value ?? '',
      remember: this.form.controls.remember.value ?? false,
    };

    this.auth.login(payload).subscribe({
      next: () => {
        if (!this.twoFactorRequired()) {
          void this.router.navigateByUrl('/');
        } else {
          this.form.controls.code.setValue('');
          this.form.controls.code.setValidators([Validators.required, Validators.minLength(6)]);
          this.form.controls.code.updateValueAndValidity();
        }
      },
      error: () => void 0,
    });
  }
}

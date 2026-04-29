import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { catchError, map, of, switchMap, tap, throwError } from 'rxjs';

export interface AuthRole {
  id: number;
  name: string;
}

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  two_factor_enabled: boolean;
  blocked_at: string | null;
  roles: AuthRole[];
  permissions: string[];
  created_at?: string;
  updated_at?: string;
}

export interface AuthEnvelope<T> {
  message: string;
  data: T;
}

export interface LoginPayload {
  email: string;
  password: string;
  remember?: boolean;
}

export interface LoginRequired2Fa {
  two_factor_required: true;
  two_factor_token: string;
}

export type LoginData = AuthUser | LoginRequired2Fa;

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);

  private readonly userSignal = signal<AuthUser | null>(null);
  private readonly loadingSignal = signal(false);
  private readonly initializedSignal = signal(false);
  private readonly twoFactorRequiredSignal = signal(false);
  private readonly pendingTwoFactorTokenSignal = signal<string | null>(null);
  private readonly errorSignal = signal<string | null>(null);

  readonly user = computed(() => this.userSignal());
  readonly loading = computed(() => this.loadingSignal());
  readonly initialized = computed(() => this.initializedSignal());
  readonly isAuthenticated = computed(() => this.userSignal() !== null);
  readonly twoFactorRequired = computed(() => this.twoFactorRequiredSignal());
  readonly pendingTwoFactorToken = computed(() => this.pendingTwoFactorTokenSignal());
  readonly error = computed(() => this.errorSignal());
  readonly canViewInternalTools = computed(() => {
    const user = this.userSignal();

    if (!user) {
      return false;
    }

    if (user.roles.some((role) => role.name === 'super-admin')) {
      return true;
    }

    return user.permissions.includes('tools.internal.view');
  });

  initialize(): void {
    if (this.initializedSignal()) {
      return;
    }

    this.initializedSignal.set(true);
    this.refreshSession().subscribe();
  }

  refreshSession() {
    this.loadingSignal.set(true);

    return this.http.get<AuthEnvelope<AuthUser>>('/api/auth/me', { withCredentials: true }).pipe(
      tap((response) => {
        this.userSignal.set(response.data);
        this.twoFactorRequiredSignal.set(false);
        this.pendingTwoFactorTokenSignal.set(null);
        this.errorSignal.set(null);
      }),
      catchError(() => {
        this.userSignal.set(null);
        return of(null);
      }),
      tap(() => this.loadingSignal.set(false)),
    );
  }

  login(payload: LoginPayload) {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    return this.getCsrfCookie().pipe(
      switchMap(() => this.http.post<AuthEnvelope<LoginData>>('/api/auth/login', payload, { withCredentials: true })),
      tap((response) => this.applyLoginResponse(response)),
      tap(() => this.loadingSignal.set(false)),
      catchError((error) => {
        this.loadingSignal.set(false);
        this.userSignal.set(null);
        this.errorSignal.set(this.extractErrorMessage(error));
        return throwError(() => error);
      }),
    );
  }

  verifyTwoFactor(token: string, code: string) {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    return this.getCsrfCookie().pipe(
      switchMap(() => this.http.post<AuthEnvelope<AuthUser>>('/api/two-factor/verify', { token, code }, { withCredentials: true })),
      tap((response) => {
        this.userSignal.set(response.data);
        this.twoFactorRequiredSignal.set(false);
        this.pendingTwoFactorTokenSignal.set(null);
      }),
      tap(() => this.loadingSignal.set(false)),
      catchError((error) => {
        this.loadingSignal.set(false);
        this.errorSignal.set(this.extractErrorMessage(error));
        return throwError(() => error);
      }),
    );
  }

  logout() {
    this.loadingSignal.set(true);

    return this.http.post<AuthEnvelope<null>>('/api/auth/logout', {}, { withCredentials: true }).pipe(
      tap(() => this.clearState()),
      catchError((error) => {
        this.clearState();
        this.errorSignal.set(this.extractErrorMessage(error));
        return throwError(() => error);
      }),
      tap(() => this.loadingSignal.set(false)),
    );
  }

  clearState(): void {
    this.userSignal.set(null);
    this.twoFactorRequiredSignal.set(false);
    this.pendingTwoFactorTokenSignal.set(null);
    this.errorSignal.set(null);
  }

  private applyLoginResponse(response: AuthEnvelope<LoginData>): void {
    if ('two_factor_required' in response.data && response.data.two_factor_required) {
      this.twoFactorRequiredSignal.set(true);
      this.pendingTwoFactorTokenSignal.set(response.data.two_factor_token);
      this.userSignal.set(null);
      return;
    }

    this.userSignal.set(response.data as AuthUser);
    this.twoFactorRequiredSignal.set(false);
    this.pendingTwoFactorTokenSignal.set(null);
  }

  private getCsrfCookie() {
    return this.http.get('/sanctum/csrf-cookie', { withCredentials: true }).pipe(map(() => void 0));
  }

  private extractErrorMessage(error: unknown): string {
    if (!error || typeof error !== 'object') {
      return 'Errore di autenticazione.';
    }

    const response = error as {
      error?: {
        message?: string;
        errors?: Record<string, string[]>;
      };
    };

    const message = response.error?.message;

    if (message) {
      return message;
    }

    const firstField = response.error?.errors ? Object.values(response.error.errors)[0] : null;
    if (firstField && firstField.length > 0) {
      return firstField[0];
    }

    return 'Errore di autenticazione.';
  }
}

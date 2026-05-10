import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, OnDestroy, OnInit, computed, effect, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { catchError, finalize, of } from 'rxjs';
import { Platform } from './platform.model';
import { AuthService } from '../../shared/services/auth.service';
import { ModalComponent } from '../../shared/ui-library/components/feedback/modal/modal.component';
import { HubCatalogSectionComponent } from './components/hub-catalog-section/hub-catalog-section.component';
import { HubFooterComponent } from './components/hub-footer/hub-footer.component';
import { HubHeaderComponent } from './components/hub-header/hub-header.component';
import { HubMobileNavComponent } from './components/hub-mobile-nav/hub-mobile-nav.component';

type HubFeature = {
  title: string;
  description: string;
  eyebrow: string;
};

type HubMetric = {
  value: string;
  label: string;
  detail: string;
};

type HubFaq = {
  question: string;
  answer: string;
};

@Component({
  selector: 'app-hub',
  standalone: true,
  imports: [
    RouterLink,
    HubCatalogSectionComponent,
    HubFooterComponent,
    HubHeaderComponent,
    HubMobileNavComponent,
    ModalComponent,
  ],
  templateUrl: './hub.component.html',
  styleUrl: './hub.component.scss',
})
export class HubComponent implements OnInit, AfterViewInit, OnDestroy {
  private readonly http = inject(HttpClient);
  private readonly auth = inject(AuthService);
  private readonly internalRequestStarted = signal(false);
  private observer: IntersectionObserver | null = null;

  readonly publicPlatforms = signal<Platform[]>([]);
  readonly internalPlatforms = signal<Platform[]>([]);
  readonly internalLoaded = signal(false);
  readonly isDrawerOpen = signal(false);
  readonly isLogoutModalOpen = signal(false);
  readonly activeSection = signal<'overview' | 'core-modules' | 'public-tools' | 'internal-tools'>('overview');
  readonly year = new Date().getFullYear();
  readonly publicCount = computed(() => this.publicPlatforms().length);
  readonly internalCount = computed(() => this.internalPlatforms().length);
  readonly currentUser = this.auth.user;
  readonly canViewInternalTools = this.auth.canViewInternalTools;
  readonly isAuthenticated = this.auth.isAuthenticated;
  readonly authError = this.auth.error;
  readonly partnerLogos = ['Angular', 'Laravel', 'Traefik', 'GitHub Actions', 'PostgreSQL'];
  readonly keyMetrics: HubMetric[] = [
    {
      value: '01',
      label: 'Single operational entrypoint',
      detail: 'Tool pubblici, moduli autenticati e accessi condividono la stessa homepage.',
    },
    {
      value: '02',
      label: 'Fast path to execution',
      detail: 'Le CTA puntano subito a catalogo, moduli core e area riservata senza passaggi superflui.',
    },
    {
      value: '03',
      label: 'Visible platform state',
      detail: 'Stati, badge e superfici tecniche mantengono leggibile l’operativita anche a colpo d’occhio.',
    },
    {
      value: '04',
      label: 'Role-aware access',
      detail: 'L’area interna resta protetta ma comprensibile anche per chi non e ancora autenticato.',
    },
  ];
  readonly featureCards: HubFeature[] = [
    {
      eyebrow: 'Public tools',
      title: 'Immediate access to operational utilities',
      description: 'Il catalogo pubblico resta il primo punto d’ingresso per utility veloci, strumenti consultabili e flussi essenziali.',
    },
    {
      eyebrow: 'Private workspace',
      title: 'Reserved modules with explicit permission gates',
      description: 'Login, ruoli e cataloghi protetti vengono comunicati con chiarezza invece di sparire dietro una UI opaca.',
    },
    {
      eyebrow: 'Platform core',
      title: 'Frontend, backend and deploys in one operating surface',
      description: 'Wyrmrest non separa presentazione e piattaforma: gli stessi moduli raccontano accesso, delivery e strumenti reali.',
    },
    {
      eyebrow: 'Navigation',
      title: 'Sticky orientation from hero to catalog',
      description: 'Header, anchor e card secondarie accompagnano lo scroll senza perdere il focus su azione e destinazione.',
    },
    {
      eyebrow: 'Status',
      title: 'Signals that feel technical, not decorative',
      description: 'Borderi, stripe, rail e badge vengono usati come indicatori di affidabilita e stato, non come ornamento generico.',
    },
    {
      eyebrow: 'Design system',
      title: 'Dark tech language aligned with the product',
      description: 'Tipografia serrata, superfici profonde e accento controllato danno alla homepage lo stesso tono del resto dell’hub.',
    },
  ];
  readonly serviceCards: HubFeature[] = [
    {
      eyebrow: 'Tool catalog',
      title: 'Public utilities that open immediately',
      description: 'Per i casi rapidi la homepage porta direttamente ai tool senza costringere l’utente a passare da schermate intermedie.',
    },
    {
      eyebrow: 'Protected area',
      title: 'Authenticated workflows for internal use',
      description: 'Quando servono permessi, ruoli o moduli riservati, l’accesso protetto e parte del flusso centrale della pagina.',
    },
    {
      eyebrow: 'Platform delivery',
      title: 'A homepage that reflects the actual stack',
      description: 'Angular, Laravel, deploy e infrastruttura non stanno sullo sfondo: informano direttamente tono e struttura della UI.',
    },
  ];
  readonly faqs: HubFaq[] = [
    {
      question: 'Tool pubblici',
      answer: 'Accesso immediato ai moduli consultabili senza autenticazione, con card orientate ad apertura rapida.',
    },
    {
      question: 'Core modules',
      answer: 'Sezioni pensate per raccontare architettura, flussi, stato operativo e responsabilita della piattaforma.',
    },
    {
      question: 'Internal area',
      answer: 'Percorso chiaro verso login e workspace autenticato, senza spezzare la continuita della homepage.',
    },
  ];
  private readonly internalAccessEffect = effect(() => {
    if (!this.auth.initialized()) {
      return;
    }

    if (!this.canViewInternalTools()) {
      this.internalPlatforms.set([]);
      this.internalLoaded.set(true);
      return;
    }

    if (this.internalRequestStarted()) {
      return;
    }

    this.internalRequestStarted.set(true);
    this.http.get<Platform[]>('/api/hub/platforms/internal', { withCredentials: true }).pipe(
      catchError(() => of([])),
      finalize(() => this.internalLoaded.set(true)),
    ).subscribe({
      next: (data) => this.internalPlatforms.set(data),
    });
  });

  ngOnInit(): void {
    this.http.get<Platform[]>('/api/hub/platforms/public').subscribe({
      next: (data) => this.publicPlatforms.set(data),
    });
  }

  ngAfterViewInit(): void {
    // Keeps sidebar/mobile nav "active" state aligned with scroll position.
    // We observe the section anchors themselves (not the <h2>) to avoid off-by-one with sticky headers.
    const ids: Array<'overview' | 'core-modules' | 'public-tools' | 'internal-tools'> = ['overview', 'core-modules', 'public-tools', 'internal-tools'];
    const targets = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => !!el);

    if (targets.length === 0) return;

    this.observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0))[0];

        const id = visible?.target?.id as typeof ids[number] | undefined;
        if (!id) return;
        this.activeSection.set(id);
      },
      {
        // Slightly favor the top portion of the viewport (matches typical "section highlight" behavior).
        root: null,
        rootMargin: '-20% 0px -70% 0px',
        threshold: [0.05, 0.2, 0.4, 0.6, 0.8],
      },
    );

    for (const el of targets) {
      this.observer.observe(el);
    }
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
    this.observer = null;
  }

  openDrawer(): void {
    this.isDrawerOpen.set(true);
  }

  closeDrawer(): void {
    this.isDrawerOpen.set(false);
  }

  openLogoutModal(): void {
    this.isLogoutModalOpen.set(true);
  }

  closeLogoutModal(): void {
    this.isLogoutModalOpen.set(false);
  }

  confirmLogout(): void {
    this.auth.logout().pipe(
      catchError(() => of(null)),
    ).subscribe(() => {
      this.closeLogoutModal();
      this.internalRequestStarted.set(false);
      this.internalPlatforms.set([]);
      this.internalLoaded.set(false);
    });
  }

  logout(): void {
    this.openLogoutModal();
  }
}

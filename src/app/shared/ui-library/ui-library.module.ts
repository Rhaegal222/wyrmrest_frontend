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

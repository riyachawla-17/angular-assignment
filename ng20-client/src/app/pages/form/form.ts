import { Component, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIf } from '@angular/common';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, NgIf],
  template: `
    <h2>Feedback Form</h2>

    <form [formGroup]="form" (ngSubmit)="onSubmit()" novalidate>
      <label>
        Name
        <input formControlName="name" placeholder="Your name" />
        <small class="err" *ngIf="showError('name','required')">Name is required</small>
        <small class="err" *ngIf="showError('name','minlength')">Min 2 characters</small>
      </label>

      <label>
        Email
        <input formControlName="email" placeholder="you@example.com" />
        <small class="err" *ngIf="showError('email','required')">Email is required</small>
        <small class="err" *ngIf="showError('email','email')">Enter a valid email</small>
      </label>

      <label>
        Message
        <textarea rows="4" formControlName="message" placeholder="Your message"></textarea>
        <small class="err" *ngIf="showError('message','required')">Message is required</small>
        <small class="err" *ngIf="showError('message','minlength')">Min 10 characters</small>
      </label>

      <button type="submit">Submit</button>
      <p class="ok" *ngIf="success()">Thanks! Your feedback is saved locally.</p>
    </form>
  `,
  styles: [`
    form { display: grid; gap: 1rem; max-width: 560px; }
    label { display: grid; gap: .35rem; }
    input, textarea { padding: .6rem .8rem; border: 1px solid #ccc; border-radius: 8px; }
    .err { color:#b00020; font-size: .85rem; }
    .ok { color: #0a7a13; }
    button { width: max-content; padding: .6rem 1rem; border:0; border-radius: 8px; background:#1976d2; color:#fff; }
  `]
})
export class FormComponent {
  private fb = new FormBuilder();
  submitted = signal(false);
  success = signal(false);

  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    message: ['', [Validators.required, Validators.minLength(10)]],
  });

  showError(ctrl: keyof typeof this.form.controls, err: string) {
    const c = this.form.controls[ctrl];
    return c.errors?.[err] && (c.touched || c.dirty || this.submitted());
  }

  onSubmit() {
    this.submitted.set(true);
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const all = JSON.parse(localStorage.getItem('feedback') ?? '[]');
    all.push(this.form.value);
    localStorage.setItem('feedback', JSON.stringify(all));

    this.success.set(true);
    this.form.reset();
    this.submitted.set(false);
  }
}

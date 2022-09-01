import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { EntryComponent } from './entry.component';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      declarations: [
        EntryComponent
      ],
    }).compileComponents();
  });

  it('should create the entry', () => {
    const fixture = TestBed.createComponent(EntryComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'synopsis'`, () => {
    const fixture = TestBed.createComponent(EntryComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('synopsis');
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(EntryComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.content span')?.textContent).toContain('synopsis entry is running!');
  });
});

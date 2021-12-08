import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EjemploFormComponent } from './ejemplo-form.component';

describe('EjemploFormComponent', () => {
  let component: EjemploFormComponent;
  let fixture: ComponentFixture<EjemploFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EjemploFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EjemploFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

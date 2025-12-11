import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Iniciosesion } from './iniciosesion';

describe('Iniciosesion', () => {
  let component: Iniciosesion;
  let fixture: ComponentFixture<Iniciosesion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Iniciosesion]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Iniciosesion);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

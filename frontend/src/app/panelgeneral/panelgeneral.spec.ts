import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Panelgeneral } from './panelgeneral';

describe('Panelgeneral', () => {
  let component: Panelgeneral;
  let fixture: ComponentFixture<Panelgeneral>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Panelgeneral]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Panelgeneral);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

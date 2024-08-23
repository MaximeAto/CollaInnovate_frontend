import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddsolutionComponent } from './addsolution.component';

describe('AddsolutionComponent', () => {
  let component: AddsolutionComponent;
  let fixture: ComponentFixture<AddsolutionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddsolutionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddsolutionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

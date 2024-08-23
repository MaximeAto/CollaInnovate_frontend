import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmmailComponent } from './confirmmail.component';

describe('ConfirmmailComponent', () => {
  let component: ConfirmmailComponent;
  let fixture: ComponentFixture<ConfirmmailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmmailComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConfirmmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

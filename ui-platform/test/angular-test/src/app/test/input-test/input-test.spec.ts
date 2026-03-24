import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputTest } from './input-test';

describe('InputTest', () => {
  let component: InputTest;
  let fixture: ComponentFixture<InputTest>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputTest]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InputTest);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

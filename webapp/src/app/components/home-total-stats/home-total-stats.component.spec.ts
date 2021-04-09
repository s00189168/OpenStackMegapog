import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeTotalStatsComponent } from './home-total-stats.component';

describe('HomeTotalStatsComponent', () => {
  let component: HomeTotalStatsComponent;
  let fixture: ComponentFixture<HomeTotalStatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomeTotalStatsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeTotalStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupUserManagementComponent } from './group-user-management.component';

describe('GroupUserManagementComponent', () => {
  let component: GroupUserManagementComponent;
  let fixture: ComponentFixture<GroupUserManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroupUserManagementComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GroupUserManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

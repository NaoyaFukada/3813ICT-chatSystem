import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChannelUserManagementComponent } from './channel-user-management.component';

describe('ChannelUserManagementComponent', () => {
  let component: ChannelUserManagementComponent;
  let fixture: ComponentFixture<ChannelUserManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChannelUserManagementComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChannelUserManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

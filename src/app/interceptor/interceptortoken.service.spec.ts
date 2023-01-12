import { TestBed } from '@angular/core/testing';

import { InterceptortokenService } from './interceptortoken.service';

describe('InterceptortokenService', () => {
  let service: InterceptortokenService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InterceptortokenService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { HttpClient } from '@angular/common/http';
import { LocalStorageAdminService } from '../local-storage-admin.service';

export abstract class RestApiCore extends LocalStorageAdminService {
  constructor(protected http: HttpClient) { super(); }

  isLogged(returnRoute: string): boolean {
    return true;
  }
}

import { Observable } from "rxjs";

export class FileElement {
  Id?: string;
  FileType?: string;
  Name!: string;
  Size?: number;
  DownloadURL?: string;
  MetaData?: any;
  ApplicationId?: string;
  VerificationDocumentName?: string;
  isFolder!: boolean;
  parent?: string;
  metaData?: any;
  uploadProgress?: Observable<number>;
}

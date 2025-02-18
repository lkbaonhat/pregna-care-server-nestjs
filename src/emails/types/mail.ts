export interface Mail {
  to: string;
  subject?: string;
  template?: string;
  data?: {
    [name: string]: any;
  };
}

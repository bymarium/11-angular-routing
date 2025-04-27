export interface IControls {
  type: 'input' | 'select';
  text: string;
  inputType?: string;
  controlName: string;
  options?: IOptions[];
}

export interface IOptions {
  value: number;
  name: string;
}
export interface IRule<T> {
  propertyName: keyof T;
  operator: 'eq' | 'regex';
  value: any;
}

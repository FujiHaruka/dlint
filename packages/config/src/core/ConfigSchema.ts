export interface ConfigSchema<T extends object> {
  validate(fields: object): fields is T
  fillDefaults(fields: T): T
  errors: any
}

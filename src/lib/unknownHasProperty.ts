export function unknownHasProperty<TProperty extends string>(
  obj: unknown,
  property: TProperty,
): obj is Record<TProperty, unknown> & Record<string, unknown> {
  return typeof obj === 'object' && obj !== null && property in obj
}

import {FormFieldDefinition} from '../lib/defineFormField'

export const createGroqProjectionForFieldDefinition = (fieldDefinition: FormFieldDefinition) => `
${Object.entries(fieldDefinition.select)
  .map(([key, value]) => `"${key}": ${value}`)
  .join(',\n')}
`

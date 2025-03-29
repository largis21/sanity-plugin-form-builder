import {FormFieldDefinition} from '../lib/defineFormField'
import {BaseFieldSelection} from '../schemas/builder/baseFormFields'

export const createGroqProjectionForFieldDefinition = (fieldDefinition: FormFieldDefinition) => `
_key,
_type,
${Object.entries(fieldDefinition.select)
  .map(([key, value]) => `"${key}": ${value}`)
  .join(',\n')}
`

export type FormFieldProjectionResult = BaseFieldSelection & {
  _type: string
  _key: string
  [key: string]: unknown
}

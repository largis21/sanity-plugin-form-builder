import {FormFieldDefinition} from '../lib/defineFormField'
import {createGroqProjectionForFields, FormField} from './createGroqProjectForFields'

export const createGroqProjectionForForm = (formFields: FormFieldDefinition[]) => `
title,
ingress,
'fields': fields[]{
  _key,
  _type,
  ${createGroqProjectionForFields(formFields)}
}
`

export type Form = {
  title?: string
  ingres?: string
  fields?: FormField[]
}

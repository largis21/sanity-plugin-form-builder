import {FormFieldDefinition} from '../lib/defineFormField'
import {
  createGroqProjectionForFields,
  FormFieldsProjectionResult,
} from './createGroqProjectForFields'

export const createGroqProjectionForForm = (fieldDefs: FormFieldDefinition[]) => `
_id,
title,
submitter,
'fields': fields[]{
  ${createGroqProjectionForFields(fieldDefs)}
}
`

export type FormProjectionResult = {
  _id: string
  title?: string
  fields?: FormFieldsProjectionResult
}

import {schemaTypeNames} from '../../../../lib/constants'
import {FormFieldDefinition} from '../../../../lib/defineFormField'
import {_getSharedSectionSchema} from './getSharedSectionSchema'

export const getSectionSchema = (fieldDefs: FormFieldDefinition[]) =>
  _getSharedSectionSchema(
    {
      name: schemaTypeNames.section,
      title: 'Section',
      type: 'object',
    },
    fieldDefs,
  )

import {schemaTypeNames} from '../../../../lib/constants'
import {FormFieldDefinition} from '../../../../lib/defineFormField'
import {_getSharedSectionSchema} from './getSharedSectionSchema'

export const getReusableSectionSchema = (fieldDefs: FormFieldDefinition[]) =>
  _getSharedSectionSchema(
    {
      name: schemaTypeNames.reusableSection,
      title: 'Reusable Section',
      type: 'document',
    },
    fieldDefs,
  )

import {schemaTypeNames} from '../../../../lib/constants'
import {FormFieldDefinition} from '../../../../lib/defineFormField'
import {_getSharedFieldsetSchema} from './getSharedFieldsetSchema'

export const getReusableFieldsetSchema = (fieldDefs: FormFieldDefinition[]) =>
  _getSharedFieldsetSchema(
    {
      name: schemaTypeNames.reusableFieldset,
      title: 'Reusable Fieldset',
      type: 'document',
    },
    fieldDefs,
  )

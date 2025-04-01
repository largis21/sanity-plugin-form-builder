import {schemaTypeNames} from '../../../../lib/constants'
import {FormFieldDefinition} from '../../../../lib/defineFormField'
import {_getSharedFieldsetSchema} from './getSharedFieldsetSchema'

export const getFieldsetSchema = (fieldDefs: FormFieldDefinition[]) =>
  _getSharedFieldsetSchema(
    {
      name: schemaTypeNames.fieldset,
      title: 'Fieldset',
      type: 'object',
    },
    fieldDefs,
  )

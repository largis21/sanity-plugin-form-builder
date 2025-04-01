import {defineArrayMember, defineType} from 'sanity'

import {schemaTypeNames} from '../../../../lib/constants'

export default defineType({
  name: schemaTypeNames.conditions,
  type: 'array',
  of: [
    defineArrayMember({type: schemaTypeNames.hasValueCondition}),
    defineArrayMember({type: schemaTypeNames.binaryOpCondition}),
  ],
})

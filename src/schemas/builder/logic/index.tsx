import {defineArrayMember, defineField, defineType} from 'sanity'

import {schemaTypeNames} from '../../../lib/constants'

export default defineType({
  name: schemaTypeNames.logic,
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
    }),

    defineField({
      name: 'conditions',
      description: 'If all of these conditions are met:',
      type: 'array',
      of: [defineArrayMember({type: schemaTypeNames.condition})],
    }),

    defineField({
      name: 'actions',
      description: 'then execute these actions',
      type: 'array',
      of: [defineArrayMember({type: schemaTypeNames.action})],
    }),
  ],
})

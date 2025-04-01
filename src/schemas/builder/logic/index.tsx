import {SchemaIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

import {schemaTypeNames} from '../../../lib/constants'

export default defineType({
  name: schemaTypeNames.logic,
  title: 'Logic',
  type: 'object',
  icon: SchemaIcon,
  preview: {
    select: {
      title: 'title',
      conditions: 'conditions',
      actions: 'actions',
    },
    prepare(selection) {
      const {title, conditions, actions} = selection
      return {
        title: title || 'Logic Rule',
        subtitle: `Conditions: ${conditions?.length || 0}, Actions: ${actions?.length || 0}`,
      }
    },
  },
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      description: 'A descriptive name for this logic rule.',
    }),

    defineField({
      name: 'conditions',
      description: 'If all of these conditions are met, the actions below will execute.',
      type: schemaTypeNames.conditions,
      validation: (Rule) => Rule.required().min(1),
    }),

    defineField({
      name: 'actions',
      type: schemaTypeNames.actions,
    }),
  ],
})

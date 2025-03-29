import {defineField, defineType} from 'sanity'

import {schemaTypeNames} from '../../../lib/constants'

export default defineType({
  name: schemaTypeNames.action,
  type: 'object',
  preview: {
    select: {
      action: 'action',
      setFormpartVisibilityAction: 'setFormpartVisibilityAction',
    },
    prepare(selection) {
      switch (selection.action) {
        case 'setFormpartVisibility':
          return {
            title: 'Set formpart visibility',
            subtitle: `Target: ${selection.setFormpartVisibilityAction.target}, Visibility: ${selection.setFormpartVisibilityAction.visibility}`,
          }

        default: {
          return {title: 'Invalid action'}
        }
      }
    },
  },
  fields: [
    defineField({
      name: 'action',
      type: 'string',
      validation: (Rule) => Rule.required(),
      options: {
        list: [{title: 'Set formpart visibility', value: 'setFormpartVisibility'}],
      },
    }),

    defineField({
      name: 'setFormpartVisibilityAction',
      type: 'object',
      hidden: ({parent}) => parent?.action !== 'setFormpartVisibility',
      fields: [
        defineField({
          name: 'target',
          type: schemaTypeNames.formPartTarget,
          validation: (Rule) => Rule.required(),
        }),

        defineField({
          name: 'visibility',
          type: 'boolean',
          validation: (Rule) => Rule.required(),
        }),
      ],
    }),
  ],
})

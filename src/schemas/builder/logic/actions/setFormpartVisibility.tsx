import {BoltIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

import {schemaTypeNames} from '../../../../lib/constants'
import {formPartTargetValidation} from '../../formPartTarget'

export default defineType({
  name: schemaTypeNames.setFormpartVisibility,
  type: 'object',
  title: 'Set formpart visibility',
  icon: BoltIcon,
  preview: {
    select: {
      target: 'target',
      visibility: 'visibility',
    },
    prepare: (selection) => {
      return {
        title: 'Set formpart visibility',
        subtitle: `Target: ${selection.target?.titleCache}\n Visibility: ${selection.visibility ? 'visible' : 'hidden'}`,
      }
    },
  },
  fields: [
    defineField({
      name: 'target',
      type: schemaTypeNames.formPartTarget,
      validation: (Rule) => Rule.required().custom(formPartTargetValidation),
    }),

    defineField({
      name: 'visibility',
      type: 'boolean',
      validation: (Rule) => Rule.required(),
    }),
  ],
})

import {EqualIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

import {schemaTypeNames} from '../../../../lib/constants'

export default defineType({
  name: schemaTypeNames.hasValueCondition,
  type: 'object',
  title: 'Has Value',
  icon: EqualIcon,
  preview: {
    select: {target: 'target'},
    prepare: (selection) => {
      return {
        title: 'Has Value',
        subtitle: `Target: ${selection.target?.titleCache}`,
      }
    },
  },
  fields: [
    defineField({
      name: 'target',
      type: schemaTypeNames.formPartTarget,
      validation: (Rule) => Rule.required(),
    }),
  ],
})

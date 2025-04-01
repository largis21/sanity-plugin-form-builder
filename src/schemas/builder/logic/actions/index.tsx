import {BoltIcon} from '@sanity/icons'
import {defineArrayMember, defineType} from 'sanity'

import {schemaTypeNames} from '../../../../lib/constants'

export default defineType({
  name: schemaTypeNames.actions,
  type: 'array',
  icon: BoltIcon,
  validation: (Rule) => Rule.required().min(1).warning('No actions defined'),
  of: [defineArrayMember({type: schemaTypeNames.setFormpartVisibility})],
})

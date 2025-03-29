import {ProjectsIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

import {schemaTypeNames} from '../../lib/constants'
import {FormFieldDefinition} from '../../lib/defineFormField'
import {fieldsArrayValidator} from '../../lib/fieldsArrayValidation'

export const getReusableFieldsetSchema = (fieldDefs: FormFieldDefinition[]) =>
  defineType({
    name: schemaTypeNames.reusableFieldset,
    title: 'Reusable Fieldset',
    type: 'document',
    icon: ProjectsIcon,
    fieldsets: [{name: 'title', title: '', options: {columns: 2, collapsible: false}}],
    preview: {
      select: {
        title: 'title',
        fields: 'fields',
      },
      prepare({title, fields}) {
        return {
          title: title,
          subtitle: `Reusable fieldset with ${fields?.length || 0} field${fields?.length === 1 ? '' : 's'}`,
        }
      },
    },
    fields: [
      defineField({
        name: 'title',
        title: 'Title',
        type: 'string',
        fieldset: 'title',
        validation: (Rule) => Rule.required(),
      }),

      defineField({
        name: 'slug',
        title: 'Name',
        type: 'slug',
        fieldset: 'title',
        validation: (Rule) => Rule.required(),
        // Validation of slugs is handled by the fieldsArrayValidator
        options: {source: 'title', isUnique: () => true},
      }),

      defineField({
        name: 'fields',
        title: 'Fields',
        type: 'array',
        of: fieldDefs.map((field) => ({type: field.schema.name})),
        validation: fieldsArrayValidator,
      }),
    ],
  })

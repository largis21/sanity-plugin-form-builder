import {ProjectsIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

import {schemaTypeNames} from '../../lib/constants'
import {FormFieldDefinition} from '../../lib/defineFormField'
import {fieldsArrayValidator} from '../../lib/fieldsArrayValidation'

export const getFieldsetSchema = (fieldDefs: FormFieldDefinition[]) =>
  defineType({
    name: schemaTypeNames.fieldset,
    title: 'Fieldset',
    type: 'object',
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
          subtitle: `Fieldset with ${fields?.length || 0} field${fields?.length === 1 ? '' : 's'}`,
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
        options: {
          source: (value, context) => (context.parent as Record<string, unknown>).title as string,
          // Validation of slugs is handled by the fieldsArrayValidator
          isUnique: () => true,
        },
        fieldset: 'title',
        validation: (Rule) => Rule.required(),
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

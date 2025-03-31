import {defineField, defineType} from 'sanity'

import {schemaTypeNames} from '../../../lib/constants'

type PreviewValue =
  | {type: 'field'; field: string}
  | {type: 'stringLiteral'; stringLiteral: string}
  | {type: 'numberLiteral'; numberLiteral: number}
  | {type: 'booleanLiteral'; booleanLiteral: boolean}

export function getConditionValue(value: PreviewValue): string {
  switch (value.type) {
    case 'field':
      return `Field: "${value.field}"`
    case 'stringLiteral':
      return `"${value.stringLiteral}"`
    case 'numberLiteral':
      return value.numberLiteral.toString()
    case 'booleanLiteral':
      return value.booleanLiteral.toString()
    default:
      return 'Unknown condition type'
  }
}

export default defineType({
  name: schemaTypeNames.conditionValue,
  type: 'object',
  preview: {
    select: {
      type: 'type',
      field: 'field',
      stringLiteral: 'stringLiteral',
      numberLiteral: 'numberLiteral',
      booleanLiteral: 'booleanLiteral',
    },
    prepare(selection) {
      return {
        title: selection.type,
        subtitle: getConditionValue(selection),
      }
    },
  },
  fields: [
    defineField({
      name: 'type',
      type: 'string',
      options: {
        list: [
          {title: 'Field', value: 'field'},
          {title: 'String literal', value: 'stringLiteral'},
          {title: 'Number literal', value: 'numberLiteral'},
          {title: 'Boolean literal', value: 'booleanLiteral'},
        ],
      },
    }),

    defineField({
      name: 'field',
      hidden: ({parent}) => parent?.type !== 'field',
      type: schemaTypeNames.formPartTarget,
      options: {getOnlyFieldSlugs: true},
    }),

    defineField({
      name: 'stringLiteral',
      hidden: ({parent}) => parent?.type !== 'stringLiteral',
      type: 'string',
    }),

    defineField({
      name: 'numberLiteral',
      hidden: ({parent}) => parent?.type !== 'numberLiteral',
      type: 'number',
    }),

    defineField({
      name: 'booleanLiteral',
      hidden: ({parent}) => parent?.type !== 'booleanLiteral',
      type: 'boolean',
    }),
  ],
})

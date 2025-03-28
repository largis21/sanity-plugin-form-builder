import {defineField, defineType} from 'sanity'

import {schemaTypeNames} from '../lib/constants'

export default defineType({
  name: schemaTypeNames.logic,
  type: 'object',
  fields: [
    defineField({
      name: 'logicType',
      type: 'string',
      options: {
        list: [
          {title: 'Literal', value: 'literal'},
          {title: 'Field', value: 'field'},
          {title: 'Binary Operator', value: 'binaryOp'},
          {title: 'Unary Operator', value: 'unaryOp'},
        ],
      },
    }),

    defineField({
      name: 'literal',
      hidden: ({parent}) => parent?.logicType !== 'literal',
      type: 'object',
      options: {collapsible: false},
      fields: [
        defineField({
          name: 'type',
          type: 'string',
          options: {
            list: [
              {title: 'String', value: 'string'},
              {title: 'Number', value: 'number'},
              {title: 'Boolean', value: 'boolean'},
            ],
          },
        }),

        defineField({
          name: 'stringValue',
          title: 'Value',
          type: 'string',
          hidden: ({parent}) => parent?.type !== 'string',
        }),

        defineField({
          name: 'numberValue',
          title: 'Value',
          type: 'number',
          hidden: ({parent}) => parent?.type !== 'number',
        }),

        defineField({
          name: 'booleanValue',
          title: 'Value',
          type: 'boolean',
          hidden: ({parent}) => parent?.type !== 'boolean',
        }),
      ],
    }),

    defineField({
      name: 'field',
      hidden: ({parent}) => parent?.logicType !== 'field',
      type: 'object',
      options: {collapsible: false},
      fields: [
        defineField({
          name: 'fieldName',
          type: 'string',
          validation: (Rule) =>
            Rule.custom((fieldName, context) => {
              if (!fieldName) return 'Field name is required'
              if (!context.document?.fields) return 'Document fields are required'
              if (!Array.isArray(context.document.fields)) return 'Document fields must be an array'
              if (!context.document.fields.some((field) => field.name.current === fieldName)) {
                return `Field "${fieldName}" does not exist`
              }
              return true
            }),
        }),
      ],
    }),

    defineField({
      name: 'binaryOp',
      hidden: ({parent}) => parent?.logicType !== 'binaryOp',
      type: 'object',
      options: {collapsible: false},
      fields: [
        defineField({
          name: 'left',
          type: schemaTypeNames.logic,
        }),

        defineField({
          name: 'operator',
          type: 'string',
          options: {
            list: [
              {title: 'And', value: '&&'},
              {title: 'Or', value: '||'},
              {title: 'Equal', value: '=='},
              {title: 'Not Equal', value: '!='},
              {title: 'Greater Than', value: '>'},
              {title: 'Greater Than or Equal', value: '>='},
              {title: 'Less Than', value: '<'},
              {title: 'Less Than or Equal', value: '<='},
            ],
          },
        }),

        defineField({
          name: 'right',
          type: schemaTypeNames.logic,
        }),
      ],
    }),
  ],
})

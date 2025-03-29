import {defineField, defineType} from 'sanity'

import {schemaTypeNames} from '../../../lib/constants'
import {getConditionValue} from './conditionValue'

export default defineType({
  name: schemaTypeNames.condition,
  type: 'object',
  preview: {
    select: {
      type: 'type',
      binaryOp: 'binaryOp',
      hasValue: 'hasValue',
    },
    prepare(selection) {
      switch (selection.type) {
        case 'binaryOp':
          return {
            title: 'Binary Operator',
            subtitle: `${getConditionValue(selection.binaryOp.left)} ${selection.binaryOp.operator} ${getConditionValue(selection.binaryOp.right)}`,
          }
        case 'hasValue':
          return {
            title: 'Has value',
            subtitle: getConditionValue(selection.hasValue),
          }
        default:
          return {title: 'Invalid'}
      }
    },
  },
  fields: [
    defineField({
      name: 'type',
      type: 'string',
      options: {
        list: [
          {title: 'Binary Operator', value: 'binaryOp'},
          {title: 'Has value', value: 'hasValue'},
        ],
      },
    }),

    defineField({
      name: 'binaryOp',
      hidden: ({parent}) => parent?.type !== 'binaryOp',
      type: 'object',
      options: {collapsible: false},
      fields: [
        defineField({
          name: 'left',
          type: schemaTypeNames.conditionValue,
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
          type: schemaTypeNames.conditionValue,
        }),
      ],
    }),

    defineField({
      name: 'hasValue',
      hidden: ({parent}) => parent?.type !== 'hasValue',
      type: schemaTypeNames.conditionValue,
    }),
  ],
})

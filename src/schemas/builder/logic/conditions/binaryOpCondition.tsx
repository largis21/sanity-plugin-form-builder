import {EqualIcon} from '@sanity/icons'
import {Card, Text} from '@sanity/ui'
import {defineField, defineType, useFormValue} from 'sanity'

import {schemaTypeNames} from '../../../../lib/constants'
import {getPrettyLogicValue} from '../logicValue'

export default defineType({
  name: schemaTypeNames.binaryOpCondition,
  type: 'object',
  title: 'Binary Operation',
  icon: EqualIcon,
  preview: {
    select: {
      left: 'left',
      operator: 'operator',
      right: 'right',
      target: 'target',
    },
    prepare: (selection) => {
      return {
        title: 'Binary operation',
        subtitle: `${getPrettyLogicValue(selection.left)} ${selection.operator || '[Invalid operator]'} ${getPrettyLogicValue(selection.right)}`,
      }
    },
  },
  fields: [
    defineField({
      name: 'note',
      type: 'string',
      components: {
        field: (props) => {
          const path = props.path.slice(0, -1)
          // eslint-disable-next-line react-hooks/rules-of-hooks, @typescript-eslint/no-explicit-any
          const binaryOpValue = useFormValue(path) as any
          return (
            <Card padding={3} tone="primary">
              <Text size={1} weight="medium">
                Current value: <br />
                {getPrettyLogicValue(binaryOpValue?.left)}{' '}
                {binaryOpValue?.operator || '[Invalid operator]'}{' '}
                {getPrettyLogicValue(binaryOpValue?.right)}
              </Text>
            </Card>
          )
        },
      },
    }),

    defineField({
      name: 'left',
      type: schemaTypeNames.logicValue,
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'operator',
      type: 'string',
      validation: (Rule) => Rule.required(),
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
      type: schemaTypeNames.logicValue,
      validation: (Rule) => Rule.required(),
    }),
  ],
})

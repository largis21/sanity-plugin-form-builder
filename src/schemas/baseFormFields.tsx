import {Flex, Stack, Text, TextInput} from '@sanity/ui'
import {ChangeEvent, useCallback, useState} from 'react'
import {
  defineField,
  FieldDefinition,
  FormFieldValidationStatus,
  ObjectFieldProps,
  set,
} from 'sanity'

export const baseFormFields: FieldDefinition[] = [
  defineField({
    name: 'name',
    title: 'Fieldname',
    type: 'object',
    components: {field: LabelField},
    group: 'field',
    validation: (Rule) => Rule.custom((value) => (value?.title && value?.name ? true : 'Required')),
    fields: [
      defineField({
        name: 'title',
        type: 'string',
      }),

      defineField({
        name: 'name',
        type: 'string',
      }),
    ],
  }),

  defineField({
    name: 'width',
    title: 'Width',
    type: 'string',
    initialValue: '12',
    validation: (Rule) => Rule.required(),
    group: 'field',
    options: {
      list: [
        {title: 'Full width', value: '12'},
        {title: 'Half width', value: '6'},
        {title: 'Third width', value: '4'},
        {title: 'Quarter width', value: '3'},
      ],
    },
  }),

  defineField({
    name: 'required',
    title: 'Required',
    type: 'boolean',
    group: 'validation',
    initialValue: false,
  }),
]

function LabelField(props: ObjectFieldProps) {
  const [value, setValue] = useState<{title: string; name: string}>(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (props.value as unknown as any) || {title: '', name: ''},
  )

  // Slugify function to convert title to label
  const slugify = (text: string) => {
    return text
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '')
      .replace(/--+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  const handleTitleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const newValue = {
        title: event.target.value,
        name: slugify(event.target.value),
      }

      setValue(newValue)
      props.inputProps.onChange(set(newValue))
    },
    [props.inputProps],
  )

  return (
    <Stack space={3}>
      <Flex direction="row" gap={2}>
        <Text size={1} weight="medium">
          Title
        </Text>
        {!!props.inputProps.validation.length && (
          <FormFieldValidationStatus validation={props.inputProps.validation} />
        )}
      </Flex>
      <TextInput
        value={value.title || ''}
        onChange={handleTitleChange}
        placeholder="Enter a label for this field"
      />
      <Text size={1} muted>
        Internal name: &quot;{value.name}&quot;
      </Text>
    </Stack>
  )
}

export const baseFieldSelection = {
  title: 'name.title',
  name: 'name.name',
  width: 'coalesce(width, "12")',
  required: 'coalesce(required, false)',
}

export type BaseFieldSelection = {
  title?: string
  name?: string
  width: string
  required: boolean
}

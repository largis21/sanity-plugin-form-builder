import {Select} from '@sanity/ui'
import {FormEventHandler, useState} from 'react'
import {defineType, set, StringInputProps, useFormValue} from 'sanity'

import {schemaTypeNames} from '../lib/constants'

export default defineType({
  name: schemaTypeNames.fieldSelect,
  type: 'string',
  components: {
    input: FieldSelectInput,
  },
})

function FieldSelectInput(props: StringInputProps) {
  const [optimisticValue, setOptimisticValue] = useState(props.value || '')

  const fields = (
    (useFormValue(['fields']) || []) as {
      _key: string
      name?: string
      title?: string
    }[]
  )?.filter((field) => field.name)

  const onChange: FormEventHandler<HTMLSelectElement> = (e) => {
    setOptimisticValue(e.currentTarget.value)
    props.onChange(set(e.currentTarget.value))
  }

  return (
    <Select onChange={onChange} defaultValue={optimisticValue}>
      <option value="" />
      {fields?.map((field) => (
        <option key={field._key} value={field.name}>
          {field.title}
        </option>
      ))}
    </Select>
  )
}

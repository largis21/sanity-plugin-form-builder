import {Select} from '@sanity/ui'
import {FormEventHandler, useEffect, useState} from 'react'
import {
  defineType,
  pathToString,
  set,
  StringDefinition,
  StringInputProps,
  useClient,
  useFormValue,
} from 'sanity'

import {schemaTypeNames} from '../../lib/constants'
import {FieldsArrayValue, getAllFieldSlugs} from '../../lib/getAllFieldSlugs'

export type FormPartTargetDefinition = Omit<StringDefinition, 'options'> & {
  type: typeof schemaTypeNames.formPartTarget
  options?: {
    getOnlyFieldSlugs?: boolean
  }
}

declare module 'sanity' {
  export interface IntrinsicDefinitions {
    [schemaTypeNames.formPartTarget]: FormPartTargetDefinition
  }
}

export default defineType({
  name: schemaTypeNames.formPartTarget,
  type: 'string',
  components: {
    input: FieldSelectInput,
  },
})

function FieldSelectInput(props: StringInputProps) {
  const [optimisticValue, setOptimisticValue] = useState(props.value || '')
  const [slugs, setSlugs] = useState<Awaited<ReturnType<typeof getAllFieldSlugs>>>([])
  const client = useClient({apiVersion: '2021-03-25'})

  const fields = useFormValue(['fields']) as FieldsArrayValue | undefined

  useEffect(() => {
    if (!fields || !fields.length) {
      return
    }

    const fetchSlugs = async () => {
      const fetchedSlugs = await getAllFieldSlugs(fields, client)
      setSlugs(fetchedSlugs)
    }

    fetchSlugs()
  }, [client, fields])

  const onChange: FormEventHandler<HTMLSelectElement> = (e) => {
    setOptimisticValue(e.currentTarget.value)
    props.onChange(set(e.currentTarget.value))
  }

  return (
    <Select onChange={onChange} value={optimisticValue}>
      <option value="" />
      {slugs?.map((slug) => (
        <option key={pathToString(slug.path) + slug.value} value={slug.value}>
          {slug.title}
        </option>
      ))}
    </Select>
  )
}

import {Flex, Select, Stack, Text} from '@sanity/ui'
import {FormEventHandler, useEffect, useState} from 'react'
import {
  defineField,
  defineType,
  FormFieldValidationStatus,
  ObjectDefinition,
  ObjectInputProps,
  pathToString,
  set,
  unset,
  useClient,
  useFormValue,
} from 'sanity'

import {schemaTypeNames} from '../../lib/constants'
import {FieldsArrayValue, getAllFieldSlugs} from '../../lib/getAllFieldSlugs'
import {unknownHasProperty} from '../../lib/unknownHasProperty'

export type FormPartTargetDefinition = Omit<ObjectDefinition, 'options'> & {
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
  type: 'object',
  fields: [
    defineField({
      name: 'path',
      type: 'string',
    }),
    defineField({
      name: 'titleCache',
      type: 'string',
    }),
  ],
  components: {
    field: (props) => {
      return (
        <Stack space={4}>
          <Flex gap={3}>
            <Text size={1} weight="medium">
              {props.title}
            </Text>
            {!!props.validation.length && (
              <FormFieldValidationStatus validation={props.validation} />
            )}
          </Flex>
          {props.children}
        </Stack>
      )
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    input: FieldSelectInput as any,
  },
})

export type FormPartTargetValue = {
  path: string
  titleCache: string
}

function FieldSelectInput(props: ObjectInputProps<FormPartTargetValue>) {
  const [optimisticValue, setOptimisticValue] = useState<FormPartTargetValue>(
    props.value || {titleCache: '', path: ''},
  )
  const [slugs, setSlugs] = useState<Awaited<ReturnType<typeof getAllFieldSlugs>>>([])
  const client = useClient({apiVersion: '2021-03-25'})

  const formType = useFormValue(['formType']) as string | undefined
  const fields = useFormValue(['fields']) as FieldsArrayValue | undefined
  const sections = useFormValue(['sections']) as FieldsArrayValue | undefined

  useEffect(() => {
    if (!formType) return

    const fieldsToUse = (formType === 'simple' ? fields : sections) || []

    const fetchSlugs = async () => {
      const fetchedSlugs = await getAllFieldSlugs(fieldsToUse, client, {
        getOnlyFieldSlugs: unknownHasProperty(props?.schemaType?.options, 'getOnlyFieldSlugs')
          ? (props?.schemaType?.options.getOnlyFieldSlugs as boolean)
          : false,
        path: ['fields'],
      })
      setSlugs(fetchedSlugs)
    }

    fetchSlugs()
  }, [client, fields, formType, props?.schemaType?.options, sections])

  const onChange: FormEventHandler<HTMLSelectElement> = (e) => {
    const value: FormPartTargetValue = {
      path: e.currentTarget.value,
      titleCache:
        slugs.find((slug) => pathToString(slug.path) === e.currentTarget.value)?.title || '',
    }
    setOptimisticValue(value)
    props.onChange(e.currentTarget.value ? set(value) : unset())
  }

  return (
    <Select onChange={onChange} value={optimisticValue.path}>
      <option value="" />
      {slugs?.map((slug) => (
        <option
          key={pathToString(slug.path)}
          value={pathToString(slug.path)}
          style={{whiteSpace: 'pre', fontFamily: 'monospace'}}
        >
          {`(${slug.formPartType})`.padEnd(19, '\u00A0')} {slug.title}
        </option>
      ))}
    </Select>
  )
}

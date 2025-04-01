import {Flex, Select, Stack, Text} from '@sanity/ui'
import {FormEventHandler, useEffect, useState} from 'react'
import {
  CustomValidatorResult,
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
  ValidationContext,
} from 'sanity'

import {schemaTypeNames, stripScopes} from '../../lib/constants'
import {FieldsArrayValue, getAllFormparts} from '../../lib/getAllFormparts'
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
    defineField({name: 'path', type: 'string'}),
    defineField({name: 'titleCache', type: 'string'}),
  ],
  validation: (Rule) => Rule.custom(formPartTargetValidation),
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

// Checks if the referenced formpart exists
export async function formPartTargetValidation(
  value: unknown,
  context: ValidationContext,
): Promise<CustomValidatorResult> {
  // The callee should handle required validation
  if (!value) return true
  if (!unknownHasProperty(value, 'path')) {
    return 'Invalid value'
  }
  if (typeof value.path !== 'string') {
    return 'Invalid value'
  }

  const client = context.getClient({apiVersion: '2021-03-25'})

  const pathQuery = value.path.replace(/\[(.*?)\]/g, '[$1][0]').replace(/\.->/g, '->')

  if (
    (context.document?.formType === 'simple' && !value.path.startsWith('fields')) ||
    (context.document?.formType === 'sections' && !value.path.startsWith('sections'))
  ) {
    return "Referenced form part doesn't exist"
  }

  const referencedFormPart = await client.fetch(`*[_id == $id][0].${pathQuery}`, {
    id: context.document?._id,
  })

  return referencedFormPart ? true : 'Referenced form part does not exist'
}

function FieldSelectInput(props: ObjectInputProps<FormPartTargetValue>) {
  const [optimisticValue, setOptimisticValue] = useState<FormPartTargetValue>(
    props.value || {titleCache: '', path: ''},
  )
  const [formparts, setFormparts] = useState<Awaited<ReturnType<typeof getAllFormparts>>>([])
  const client = useClient({apiVersion: '2021-03-25'})

  const formType = useFormValue(['formType']) as string | undefined
  const fields = useFormValue(['fields']) as FieldsArrayValue | undefined
  const sections = useFormValue(['sections']) as FieldsArrayValue | undefined

  useEffect(() => {
    if (!formType) return

    const fieldsToUse = (formType === 'simple' ? fields : sections) || []

    const fetchFormparts = async () => {
      const fetchedFormparts = await getAllFormparts(fieldsToUse, client, {
        getOnlyFields: unknownHasProperty(props?.schemaType?.options, 'getOnlyFields')
          ? (props?.schemaType?.options.getOnlyFields as boolean)
          : false,
        path: [formType === 'simple' ? 'fields' : 'sections'],
      })
      setFormparts(fetchedFormparts)
    }

    fetchFormparts()
  }, [client, fields, formType, props?.schemaType?.options, sections])

  const onChange: FormEventHandler<HTMLSelectElement> = (e) => {
    const value: FormPartTargetValue = {
      path: e.currentTarget.value,
      titleCache:
        formparts.find((slug) => pathToString(slug.path) === e.currentTarget.value)?.titleCache ||
        '',
    }
    setOptimisticValue(value)
    props.onChange(e.currentTarget.value ? set(value) : unset())
  }

  return (
    <Select onChange={onChange} value={optimisticValue.path}>
      <option value="" />
      {formparts?.map((formpart) => (
        <option
          key={pathToString(formpart.path)}
          value={pathToString(formpart.path)}
          style={{whiteSpace: 'pre', fontFamily: 'monospace'}}
        >
          {`(${stripScopes(formpart.value._type)})`.padEnd(19, '\u00A0')} {formpart.titleCache}
        </option>
      ))}
    </Select>
  )
}

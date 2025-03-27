import {standardSchemaResolver} from '@hookform/resolvers/standard-schema'
import {Flex} from '@sanity/ui'
import {evaluate, parse} from 'groq-js'
import {useEffect, useState} from 'react'
import {useForm} from 'react-hook-form'
import {UserViewComponent} from 'sanity/structure'

import {FormFieldDefinition} from '../lib/defineFormField'
import {getFormValidationSchema} from '../lib/getFormValidationSchema'
import {FormProjectionResult} from '../queries/createGroqProjectionForForm'
import {FormFieldsComponent} from './FormFields'

export const GetFormPreviewComponent = (
  groqProjection: string,
  fieldDefs: FormFieldDefinition[],
  FormFields: FormFieldsComponent,
): UserViewComponent => {
  const query = `*[0] { ${groqProjection} }`
  const queryAst = parse(query)

  return function FormPreview(props) {
    const [form, setForm] = useState<FormProjectionResult | null>(null)

    const hook = useForm({
      resolver: form ? standardSchemaResolver(getFormValidationSchema(fieldDefs, form)) : undefined,
    })

    useEffect(() => {
      async function onDocumentChange() {
        setForm(
          await (
            await evaluate(queryAst, {
              dataset: [props.document.displayed],
            })
          ).get(),
        )
      }

      onDocumentChange()
    }, [props.document.displayed])

    return (
      <Flex
        justify={'center'}
        align="center"
        height={'fill'}
        style={{backgroundColor: '#FFF', color: '#000'}}
        padding={4}
      >
        {form && (
          <form
            style={{maxWidth: '500px'}}
            onSubmit={hook.handleSubmit((data) => {
              // eslint-disable-next-line no-console
              console.log('Submitted', data)
            })}
            noValidate
          >
            <FormFields form={form} hook={hook} />
            <button
              type="submit"
              style={{
                marginTop: '1rem',
                backgroundColor: ' #3182ce',
                color: '#FFF',
                border: 'none',
                borderRadius: '4px',
                padding: '0.5rem 1rem',
                cursor: 'pointer',
                opacity: hook.formState.isSubmitting ? 0.5 : 1,
              }}
              disabled={hook.formState.isSubmitting}
            >
              Submit
            </button>
          </form>
        )}
      </Flex>
    )
  }
}

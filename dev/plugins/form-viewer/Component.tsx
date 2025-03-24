import {useState, useEffect} from 'react'
import {useClient} from 'sanity'
import {Form, schemaTypeNames} from 'sanity-plugin-form-builder'
import {Box, Text, Select, Stack} from '@sanity/ui'
import {formGroqProjection, RenderForm} from '../form-builder'

export function FormViewComponent() {
  const [loadedForms, setLoadedForms] = useState<Form[]>([])
  const [selectedFormId, setSelectedFormId] = useState<string | null>(null)
  const client = useClient({apiVersion: '2021-10-21'})

  useEffect(() => {
    const fetchForms = async () => {
      const data = await client.fetch<Form[]>(`
        *[_type == "${schemaTypeNames.formBuilder}"] {
          ${formGroqProjection}
         }
      `)
      setLoadedForms(data)
    }
    fetchForms()
  }, [client])

  const selectedForm = loadedForms.find((e) => e._id === selectedFormId)

  return (
    <Box padding={4}>
      <Stack space={6}>
        <Stack space={2} style={{width: 320}}>
          <Text>Select a form:</Text>
          <Select
            value={selectedFormId || ''}
            onChange={(e) => setSelectedFormId(e.currentTarget.value)}
          >
            <option key={'0'} value={''}></option>
            {loadedForms.map((form) => (
              <option key={form._id} value={form._id}>
                {form.title}
              </option>
            ))}
          </Select>
        </Stack>

        <div
          style={{
            padding: '32px',
            backgroundColor: '#f3f3f3',
            width: 'fit-content',
            borderRadius: '8px',
          }}
        >
          {selectedForm && <RenderForm form={selectedForm} />}
        </div>
      </Stack>
    </Box>
  )
}

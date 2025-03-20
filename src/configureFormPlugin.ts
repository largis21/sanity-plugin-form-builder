import {Plugin} from 'sanity'
import {DefaultDocumentNodeResolver} from 'sanity/structure'

import {getRenderForm, RenderForm} from './components/RenderForm'
import {defaultDocumentNodeResolver} from './lib/defaultDocumentNodeResolver'
import {
  convertToInternalFormFieldDefinition,
  FormFieldDefinition,
  FormFieldDefinitionInput,
} from './lib/defineFormField'
import {createGroqProjectionForForm} from './queries/createGroqProjectionForForm'
import {getFormBuilderSchema} from './schemas/builder'

export interface PluginConfig {
  fields: FormFieldDefinitionInput[]
}

/**
 * Example Usage:
 * Create a new folder in your project for the plugin, e.g. `src/sanity/plugins/form-builder`
 *
 * form-builder/index.ts
 * ```ts
 * const {formPlugin} = configureFormPlugin({
 *   customFields: [
 *     // Add your custom fields here
 *   ],
 * })
 *
 * export { formPlugin }
 * ```
 *
 * sanity.config.ts
 * ```ts
 * import {formPlugin} from 'src/sanity/plugins/form-builder'
 *
 * export default defineConfig({
 *   plugins: [
 *     formPlugin(),
 *   ],
 * })
 * ```
 */
export const configureFormPlugin = (
  config: PluginConfig,
): {
  formPlugin: Plugin
  groqProjection: string
  defaultDocumentNodeResolver: DefaultDocumentNodeResolver
  RenderForm: RenderForm
} => {
  const formFields: FormFieldDefinition[] = config.fields.map((field) =>
    convertToInternalFormFieldDefinition(field),
  )

  const groqProjection = createGroqProjectionForForm(formFields)

  const renderForm = getRenderForm(formFields)

  return {
    formPlugin: () => ({
      name: 'sanity-plugin-form-builder',
      schema: {
        types: [getFormBuilderSchema(formFields), ...formFields.map((field) => field.schema)],
      },
    }),
    groqProjection,
    defaultDocumentNodeResolver: defaultDocumentNodeResolver(groqProjection, renderForm),
    RenderForm: renderForm,
  }
}

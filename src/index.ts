import {Plugin} from 'sanity'
import {DefaultDocumentNodeResolver} from 'sanity/structure'

import {getRenderForm, RenderForm} from './components/RenderForm'
import {defaultFormFields} from './fields'
import {defaultDocumentNodeResolver} from './lib/defaultDocumentNodeResolver'
import {FormFieldDefinition} from './lib/defineFormField'
import {createGroqProjectionForForm} from './queries/createGroqProjectionForForm'
import {getFormBuilderSchema} from './schemas/builder'

export interface PluginConfig {
  customFields: FormFieldDefinition[]
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
  config?: PluginConfig,
): {
  formPlugin: Plugin
  groqProjection: string
  defaultDocumentNodeResolver: DefaultDocumentNodeResolver
  RenderForm: RenderForm
} => {
  const formFields: FormFieldDefinition[] = [...defaultFormFields, ...(config?.customFields || [])]

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
    defaultDocumentNodeResolver: defaultDocumentNodeResolver(
      formFields,
      groqProjection,
      renderForm,
    ),
    RenderForm: renderForm,
  }
}

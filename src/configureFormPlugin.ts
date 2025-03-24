import {StandardSchemaV1} from '@standard-schema/spec'
import {Plugin} from 'sanity'
import {DefaultDocumentNodeResolver} from 'sanity/structure'

import {FormFieldsComponent, getFormFieldsComponent} from './components/FormFields'
import {defaultDocumentNodeResolver} from './lib/defaultDocumentNodeResolver'
import {
  convertToInternalFormFieldDefinition,
  FormFieldDefinition,
  FormFieldDefinitionInput,
} from './lib/defineFormField'
import {getFormValidationSchema} from './lib/getFormValidationSchema'
import {
  createGroqProjectionForForm,
  FormProjectionResult,
} from './queries/createGroqProjectionForForm'
import {getFormBuilderSchema} from './schemas/builder'

export interface PluginConfig {
  /**
   * An array of field definitions to be used in the form builder
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fields: FormFieldDefinitionInput<any, any>[]

  /**
   * Configuration for the submissions tool
   */
  submissionsTool?: {
    /**
     * Whether or not to enable the submissions tool
     * @defaultValue true
     */
    enabled: boolean
  }
}

/**
 * Example Usage:
 * Create a new folder in your project for the plugin, e.g. `src/sanity/plugins/form-builder`
 *
 * form-builder/index.ts
 * ```ts
 * const {formPlugin} = configureFormPlugin({
 *   fields: [
 *     stringField,
 *     textField,
 *     checkboxField,
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
  FormFields: FormFieldsComponent
  getFormValidationSchema: (form: FormProjectionResult) => StandardSchemaV1
} => {
  const fieldDefs: FormFieldDefinition[] = config.fields.map((field) =>
    convertToInternalFormFieldDefinition(field),
  )

  const groqProjection = createGroqProjectionForForm(fieldDefs)

  const FormFields = getFormFieldsComponent(fieldDefs)

  return {
    formPlugin: () => ({
      name: 'sanity-plugin-form-builder',
      schema: {
        types: [getFormBuilderSchema(fieldDefs), ...fieldDefs.map((field) => field.schema)],
      },
    }),
    groqProjection,
    defaultDocumentNodeResolver: defaultDocumentNodeResolver(groqProjection, fieldDefs, FormFields),
    FormFields: FormFields,
    getFormValidationSchema: (form: FormProjectionResult) =>
      getFormValidationSchema(fieldDefs, form),
  }
}

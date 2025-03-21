import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
import {defaultDocumentNodeResolver, formPlugin} from './plugins/form-builder'
import {formViewer} from './plugins/form-viewer'

export default defineConfig({
  name: 'default',
  title: 'form-builder-plugin',

  projectId: 't4ng4x1p',
  dataset: 'production',

  plugins: [
    structureTool({
      defaultDocumentNode: defaultDocumentNodeResolver,
    }),
    visionTool(),
    formPlugin(),
    formViewer(),
  ],

  schema: {
    types: schemaTypes,
  },
})

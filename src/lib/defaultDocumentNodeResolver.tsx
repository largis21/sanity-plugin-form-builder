import {DefaultDocumentNodeResolver} from 'sanity/structure'

import {GetFormPreviewComponent} from '../components/FormPreview'
import {FormFieldsComponent} from '../components/FormFields'
import {schemaTypeNames} from './constants'

export const defaultDocumentNodeResolver =
  (groqProjection: string, FormFields: FormFieldsComponent): DefaultDocumentNodeResolver =>
  (S, context) => {
    if (context.schemaType === schemaTypeNames.formBuilder) {
      return S.document().views([
        S.view.form(),
        S.view.component(GetFormPreviewComponent(groqProjection, FormFields)).title('Form Preview'),
      ])
    }
  }

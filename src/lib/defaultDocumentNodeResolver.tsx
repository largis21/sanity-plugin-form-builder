import {DefaultDocumentNodeResolver} from 'sanity/structure'

import {FormFieldsComponent} from '../components/FormFields'
import {GetFormPreviewComponent} from '../components/FormPreview'
import {schemaTypeNames} from './constants'
import {FormFieldDefinition} from './defineFormField'

export const defaultDocumentNodeResolver =
  (
    groqProjection: string,
    fieldDefs: FormFieldDefinition[],
    FormFields: FormFieldsComponent,
  ): DefaultDocumentNodeResolver =>
  (S, context) => {
    if (context.schemaType === schemaTypeNames.formBuilder) {
      return S.document().views([
        S.view.form(),
        S.view
          .component(GetFormPreviewComponent(groqProjection, fieldDefs, FormFields))
          .title('Form Preview'),
      ])
    }
  }

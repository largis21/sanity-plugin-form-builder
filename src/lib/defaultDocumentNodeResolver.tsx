import {DefaultDocumentNodeResolver} from 'sanity/structure'

import {GetFormPreviewComponent} from '../components/FormPreview'
import {RenderForm as iRenderFOrm} from '../components/RenderForm'
import {FormFieldDefinition} from './defineFormField'

export const defaultDocumentNodeResolver =
  (
    formFields: FormFieldDefinition[],
    groqProjection: string,
    RenderForm: iRenderFOrm,
  ): DefaultDocumentNodeResolver =>
  (S) =>
    S.document().views([
      S.view.form(),
      S.view
        .component(GetFormPreviewComponent(formFields, groqProjection, RenderForm))
        .title('Form Preview'),
    ])

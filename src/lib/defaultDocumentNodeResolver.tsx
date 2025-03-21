import {DefaultDocumentNodeResolver} from 'sanity/structure'

import {GetFormPreviewComponent} from '../components/FormPreview'
import {RenderForm as iRenderFOrm} from '../components/RenderForm'
import {schemaTypeNames} from './constants'

export const defaultDocumentNodeResolver =
  (groqProjection: string, RenderForm: iRenderFOrm): DefaultDocumentNodeResolver =>
  (S, context) => {
    if (context.schemaType === schemaTypeNames.formBuilder) {
      return S.document().views([
        S.view.form(),
        S.view.component(GetFormPreviewComponent(groqProjection, RenderForm)).title('Form Preview'),
      ])
    }
  }

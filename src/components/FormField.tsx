import {ReactNode} from 'react'

import {FormField as iFormField} from '../queries/createGroqProjectionForFieldDefinition'

export function FormField(props: {field: iFormField; children: ReactNode}) {
  return (
    <div
      style={{
        gridColumn: `span ${props.field.width}`,
      }}
    >
      {props.children}
    </div>
  )
}

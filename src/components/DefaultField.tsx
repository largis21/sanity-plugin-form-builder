import {FieldComponentProps} from '../lib/defineFormField'

export function DefaultField(props: FieldComponentProps) {
  return (
    <label style={{display: 'flex', flexDirection: 'column', fontSize: '14px'}}>
      {props.field.title}
      {props.renderInput(props.inputProps)}
      {props.error && props.renderError({error: props.error})}
    </label>
  )
}

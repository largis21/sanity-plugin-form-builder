import {FieldComponentProps} from '../lib/defineFormField'

export function DefaultField(props: FieldComponentProps) {
  return (
    <div>
      <label style={{display: 'flex', flexDirection: 'column', fontSize: '14px'}}>
        <span>
          {props.field.title} <span style={{color: 'red'}}>{props.field.required && '*'}</span>
        </span>
        {props.renderInput(props.inputProps)}
      </label>
      {props.renderError({error: props.error})}
    </div>
  )
}

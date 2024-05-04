import LoadingSpinner from './LoadingSpinner'

function Button({as='button',variant='primary',type,loading,label,...props}) {
  const Element = as
  return (
    <Element data-type={variant} disabled={loading} type={type} {...props} className={`button ${props.className}`}>{loading ? <LoadingSpinner /> : label}</Element>
  )
}

export default Button
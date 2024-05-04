import StatusIndicator from "./StatusIndicator"

function Badge({children, ...props}) {
  return (
    <span {...props} className='badge'>{children}</span>
  )
}

function Address({address, ...props}) {
  return <Badge style={{fontSize: 'inherit', padding: '0.25em'}} {...props}>{address.substring(0,6)+'...'+address.substring(address.length - 4, address.length)}</Badge>
}

function Validity({isValid, ...props}) {
  return <Badge><StatusIndicator status={isValid ? 'active' : 'inactive'}/> <span>{isValid ? 'Valid' : 'Invalid'}</span></Badge>
}

export default Badge

Badge.Address = Address
Badge.Validity = Validity
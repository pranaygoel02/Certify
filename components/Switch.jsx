import { useState } from "react"

function Switch({on, toggle}) {
  const [up, setUp] = useState(on)
    return (
    <button onClick={async (e) => {
            try {
                setUp(prev => !prev);
                await toggle(e)
            }
            catch(e) {
                console.log(e)
                setUp(on)
            }
        }} className={`max-w-[50px] w-full p-1 rounded-2xl ${up ? 'bg-green-500' : 'bg-transparent'} outline outline-[1px] outline-neutral-600`}>
        <span className={`aspect-square h-full min-w-[16px] rounded-full bg-white ${up ? 'float-right' : 'float-left'} transition-all`}></span>
    </button>
  )
}

export default Switch
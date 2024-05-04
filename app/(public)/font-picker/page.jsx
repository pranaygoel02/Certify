'use client'
import FontPicker from '@/components/FontPicker'

function page() {
  return (
    <>
    <FontPicker initialFontName={'Open Sans'} onChange={(fontFamily, fontVariant) => {
        console.log(fontFamily, fontVariant);
        document.getElementById('para').style.fontFamily = `${fontFamily}_${fontVariant}`
    }}/>
    <p id='para'>Lorem ipsum</p>
    </>
  )
}

export default page
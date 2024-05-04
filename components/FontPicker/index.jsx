import fonts from '@/lib/fonts.json'
import { memo, useEffect, useMemo, useState } from 'react';

const FontPicker = memo(function _({onChange=()=>{}, initialFont=null}) {
    
    // const [selectedFont, setSelectedFont] = useState(initialFontName?.split('_')?.[0])
    // const [selectedVariant, setSelectedVariant] = useState(initialFontName?.split('_')?.[1])

    const selectedFont = initialFont?.split('_')?.[0]
    const selectedVariant = initialFont?.split('_')?.[1]

    console.log('selected fonts >>> ',selectedFont, selectedVariant);
    
    const [fontFamilies, fontVariants] = useMemo(() => {
        return fonts.items.reduce((acc, font) => {
            acc[0].push(font.family)
            acc[1][font.family] = font.variants
            return acc
        }, [[], {}])
    },[])

    // useEffect(() => {
    //     setSelectedVariant(fontVariants[selectedFont]?.[0])
    // },[selectedFont, fontVariants])

    const handleFontChange = ({font, variant}) => {
        onChange({fontName: font, fontVariant: variant, fontFamily: `${font}_${variant}`})
    }

    // useEffect(() => {
    //     onChange({fontName: selectedFont, fontVariant: selectedVariant, fontFamily: `${selectedFont}_${selectedVariant}`})
    // },[selectedFont, selectedVariant, onChange])
  
    return (
      <>
        <select onChange={(e) => handleFontChange({font: e.target.value, variant: selectedVariant})} name='font-family' value={selectedFont}>
            {
                fontFamilies?.map((family) => (
                    <option key={family} value={family}>{family}</option>
                ))
            }
        </select>
        <select name='font-variant' onChange={(e) => handleFontChange({font: selectedFont, variant: e.target.value})} value={selectedVariant}>
            {
                (fontVariants?.[selectedFont] ?? [])?.map((variant) => (
                    <option key={variant} value={variant}>{variant}</option>
                ))
            }
        </select>
      </>
    );
  });
  

export default FontPicker
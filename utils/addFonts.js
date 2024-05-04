import fonts from '@/lib/fonts.json'
import { useEffect } from 'react';

export const AddFonts = () => {
 
    const loadFont = (fontName, fontUrl) => {
        const style = document.createElement('style');
        style.innerHTML = `
          @font-face {
            font-family: '${fontName}';
            src: url('${fontUrl}');
          }
        `;
        document.head.appendChild(style);
    }

    useEffect(() => {
        fonts.items.map(font => {
            const name = font.family
            const variants = Object.entries(font.files)
            variants.map(([variant, url]) => {
                loadFont(`${name}_${variant}`, url)
            })
        })
    },[])
}

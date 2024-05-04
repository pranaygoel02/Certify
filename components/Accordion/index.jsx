import { FaChevronDown } from "react-icons/fa";
import { useState } from "react";
import './Accordion.css'

export default function Accordion({ children, label, className, contentClassName, expandIcon, index }) {
    const [open, setOpen] = useState(false);
    return (
      <div className={`accordion__container ${open ? 'active' : ''}`}>
        <div onClick={() => setOpen(prev => !prev)} className={`accordion_head ${open ? 'active' : ''}`} >
          <p className="subtext">{label}</p>
          <FaChevronDown className={`transition-all ${open ? 'rotate-180' : 'rotate-0'}`}/>
        </div>
        <div className={`accordion ${open ? 'accordion_active' : ''}`}>
          <div>
            {children}
          </div>
        </div>
      </div>
    );
  };
import React , {FC, useState} from 'react'

type props ={
    open:boolean;
    setOpen:(open:boolean)=>void;
    activeItem:number;
}

const Header:FC<Props> = {props}=>{
    const [open,setOpen] = useState(false);
    const [activeItem,setActiveItem] = useState(false)
        return (
        <div>Header</div>
    )
}
export default Header;
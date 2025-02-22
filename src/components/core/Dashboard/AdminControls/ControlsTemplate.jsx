import { useState } from "react";
import { IoIosArrowDropdown } from "react-icons/io";
import IconBtn from "../../../Common/IconBtn";

export default function ControlsTemplate({ onSubmit, text = 'Delete a User', url = '/admin/deleteUserPermanently', children}) {
    const [dropdown, setDropDown] = useState(false);
    return (
        <div className="flex flex-col gap-y-4 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-8 px-12">
            
            <div className="flex items-center justify-between h-[40px]">
                <div className="flex items-center gap-x-4">
                    <IoIosArrowDropdown className={`text-richwhite-300 text-2xl -ml-5 ${dropdown ? '' : '-rotate-90'}`} onClick={() => setDropDown(!dropdown)} /> 
                    <div className="space-y-1 text-lg font-semibold text-richblack-5">
                        {text}
                    </div>
                </div>
                <p className="text-sm text-richblack-300">
                    {url}
                </p>
                {dropdown && <div className="flex gap-5">
                    <IconBtn
                        text="Execute"
                        onclick={onSubmit}
                    />
                </div>}  
            </div>
            {dropdown && children}
        </div>
    );
}
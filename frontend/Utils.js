import { toast } from "react-toastify"


export const handleSucess=(msg)=>{
    console.log(msg)
    toast.success(msg,{
        position:'top-right'
    })
}

export const handleError=(msg)=>{
    console.log(msg)
    toast.error(msg,{
        position:'top-right'
    })
}
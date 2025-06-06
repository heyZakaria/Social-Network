import { useState } from "react"

export default function searchBar({Target , Condition }){

const [Target , setTarget] = useState(Target)
const [SearchResult , setSearchResult] = useState()
    function HandleChange(e){
        if (e.Target.value !== '') setSearchResult(prev => {
            prev.filter(prev)
        })
    }
    return (

        <input type="text"></input>
    )
}
import useFetch from "@/hooks/useFetch"
import { useEffect, useState } from "react"
import Image from 'next/image'


export default function PendingInviteList({groupId}){
    // const [load , setLoad] = useState(false)
    const [err , setError] = useState(null)
    const [Invites, setInvites] = useState([])
    const {data , error , loading} = useFetch(`http://localhost:8080/api/groups/group/pending?group_id=${groupId}`)
    useEffect(()=>{
       if (data)setInvites(data)
    }, [data])
    if (loading) return <p>loading...</p>
    if (error){setError(error)}

    return (
        <>
       <ul>
        {Invites.map(invite => <PendingInvite 
        Invite={invite}
        OnInvite={(id)=>{setInvites(prev => prev.filter(inv => inv.invite_id != id))}}
        ></PendingInvite> )}
       </ul>
       {err && <p>{error}</p>}
       </>
    )
}

function PendingInvite({ Invite  , OnInvite}){
     
    const [ActionError ,setActionError ] = useState(null)
    // const {data , error } =  useFetch(`http://localhost:8080/api/groups/group/invite/approve?Action=${e.target.value}&Invite=${Invite.id}`)
const HandleInviteResponse = async(e)=>{

    try {
        const respo = await fetch(`http://localhost:8080/api/groups/group/invite/approve?Action=${e.target.value}&Invite=${Invite.invite_id}`,
            {credentials : 'include',
            method:"POST",
            }
        )
        const res = await respo.json()
        if (!respo.ok || !respo.success)throw new Error(res.message || "failed to process this Action")
            OnInvite(Invite.invite_id)
    } catch (error) {
        setActionError(error)
    }
}
    return(
        <li id ={Invite.invite_id} key={Invite.invite_id}>
            <Image 
            width='100' 
            hieght='100'
            src={`${Invite.avatar}`}
            ></Image>
            <p>{`${Invite.first_name} ${Invite.last_name}`}</p>
            <button value="accept" onClick={HandleInviteResponse}>Accept</button>
            <button  value="reject" onClick={HandleInviteResponse}>Reject</button>
            {ActionError && <p style={{ color: "red" }}>{ActionError}</p> }
        </li>
    )
}

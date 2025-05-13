"use client"

import { useState } from "react"
import styles from './CreateGroup.module.css';
import GroupCard from "./GroupCard";

export default function CreateGroupCard() {
    /* Testing the GroupCard WithDummyData
    -Still Need A cover Comp 
    -FetchPosts (and Post Feats) as Children*/
    const groupCardData = {
        groupName: "React Enthusiasts",
        description: "A community of developers passionate about building with React.",
        members: [
          {
            id: 1,
            name: "Alice Johnson",
            picture: "https://randomuser.me/api/portraits/women/1.jpg"
          },
          {
            id: 2,
            name: "Bob Smith",
            picture: "https://randomuser.me/api/portraits/men/2.jpg"
          },
          {
            id: 3,
            name: "Charlie Brown",
            picture: null // No picture
          }
        ],
        children: <p>Join our next meetup on Friday!</p> //posts will be here
      };


    /* Create Group Logic Begin From Here 
    - Still Need to check if the user is Authenticated 
    - Make the InputComp Adjust size with props ( to make better visual UI)
    */
          const [Display, SetDisplay] = useState(false)
    // const[Title, SetTitle] = useState('')
    // const[Description, SetDescription] = useState('')
    // const[DescriptionErr, SetDescErr] = useState('')
    const [FormData, SetFormData] = useState({ Description: '', Title: '' })
    const [FormErr, SetFormErr] = useState({ DescriptionErr: null, TitleErr: null })
    const [Err, SetErr] = useState(null)
    const [SuccessMsg, SetSuccesMsg] = useState(null)

    function HandleChange(e) {
        function validateDescription(Description) {
            if (Description === '') {
                SetFormErr(prevData => ({
                    ...prevData,
                    DescriptionErr: 'Description is Required'
                }))
                return
            }
            if (Description.length < 30 || Description.length > 250) {
                SetFormErr(prevData => ({
                    ...prevData,
                    DescriptionErr: 'Description Should be Between 30 and 250 Letter'
                }))
                return
            }
            SetFormErr(prevData =>({...prevData , DescriptionErr:null}))

        }
        function validateTitle(Title) {
            if (Title === '') {
                SetFormErr(prevData => ({
                    ...prevData,
                    TitleErr: 'Title is Required'
                }))
                return
            }
            if (Title.length < 10 || Title.length > 100) {
                SetFormErr(prevData => ({
                    ...prevData,
                    TitleErr: 'Title Should be Between 10 and 100 Letter'
                }))
                return
            }
            SetFormErr(prevData =>({...prevData , TitleErr:null}))
        }
        console.log(e , e.target);
        
        const {name, value} = e.target
        if (name === 'Title') {
            validateTitle(value)
        } else if (name === 'Description') {
            validateDescription(value)
        }
        SetFormData((prevData) => ({ ...prevData, [name]: value }))
    }

    function HandleDisplay() {
        SetDisplay(!Display)
    }
    async function handleSubmit(e) {
        e.preventDefault()
    
        if (FormData.Description === '' || FormData.Title === '' || FormErr.TitleErr !== null || FormErr.DescriptionErr !== null){
            console.log(FormData , FormErr);
            
            console.log("yeeep heeere");
            
            return
        }
        try {
            const Resp = await fetch("http://localhost:8080/api/groups/", {
                method: "POST",
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(FormData)
            }

            )
            const Data = await Resp.json()
            if (Resp.ok) {
                SetSuccesMsg("Group Created Successfuly")
            } else {
                SetErr(Data.msg || 'Error Occured')
            }

        } catch (error) {
            SetErr("Error Sending Request")
        }

    }
    return (
        <div className={styles.createGroupContainer}>

<GroupCard
      groupName={groupCardData.groupName}
      description={groupCardData.description}
      members={groupCardData.members}
    >
      {groupCardData.children}
    </GroupCard>  

        <h3 className={styles.heading3}>Create Group</h3>
        <form onSubmit={handleSubmit} className={styles.createGroupForm}>
    
                <InputComp
                    name="Title"
                    placeholder="Enter Title"
                    label="Title"
                    onChange={HandleChange}
                />
                {FormErr.TitleErr &&  <ErrorComp Err={FormErr.TitleErr}></ErrorComp>}


                <InputComp
                    name="Description"
                    placeholder="Enter Description"
                    label="Description"
                    onChange={HandleChange}
                />
                {FormErr.DescriptionErr && <ErrorComp Err={FormErr.DescriptionErr}></ErrorComp> }

            <button type="submit" className={styles.submitBtn} disabled={Display}>
                Create Group
            </button>

            {SuccessMsg && <p className={styles.successMessage}>{SuccessMsg}</p>}
            {Err && <ErrorComp Err={Err}></ErrorComp>}
        </form>



  </div>
      
      
    )
}


function InputComp({ onChange, name, label }) {
    return (
        <div className={styles.formGroup}>
            <label className={styles.label} htmlFor={name}>{label}</label>
            <input
                className={styles.inputText}
                name={name}
                placeholder={label}
                onChange={onChange}
            />
        </div>
    )
}
function ErrorComp({Err}){
    return  <p className={styles.serverError}>{Err}</p>
}
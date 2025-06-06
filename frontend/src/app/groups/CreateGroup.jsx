"use client"

import { useState } from "react"

export default function CreateGroupCard() {

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
            }
            if (Description.length < 30 || Description.length > 250) {
                SetFormErr(prevData => ({
                    ...prevData,
                    DescriptionErr: 'Description Should be Between 30 and 250 Letter'
                }))
            }

        }
        function validateTitle(Title) {
            if (Title === '') {
                SetFormErr(prevData => ({
                    ...prevData,
                    TitleErr: 'Title is Required'
                }))
            }
            if (Description.length < 10 || Description.length > 100) {
                SetFormErr(prevData => ({
                    ...prevData,
                    TitleErr: 'Title Should be Between 10 and 100 Letter'
                }))
            }
        }
        const [name, value] = e.target
        if (name === 'Title') {
            validateTitle(name)
        } else if (name === 'Description') {
            validateDescription(name)
        }
        SetFormData((prevData) => ({ ...prevData, [name]: value }))
    }

    async function handleSubmit(e) {
        e.preventDefault()

        if (!FormData.Description || !FormData.Title || FormErr.TitleErr || FormErr.DescriptionErr) {
            return
        }
        try {
            const Resp = fetch("/api/groups", {
                method: "POST",
                headers: {
                    'Content-type': 'application/json'
                },
                credentials: 'include',
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
        <>

            <form onSubmit={handleSubmit}>
                <InputComp
                    type='input'
                    placeholder="Enter Title"
                    name="Title"
                    onChange={HandleChange}
                ></InputComp>
                {FormErr.TitleErr && <ErrorComponent Err={FormErr.TitleErr}></ErrorComponent>}
                <InputComp
                    type='input'
                    placeholder="Enter Description"
                    onChange={HandleChange}
                    name="Description">
<<<<<<< HEAD
                {FormErr.DescriptionErr && <ErrorComponent Err={FormErr.deci}></ErrorComponent>}
                </InputComp>


                                <InputComp
                    
                    onChange={HandleChange}
                    name="Description">
                {FormErr.DescriptionErr && <ErrorComponent Err={FormErr.deci}></ErrorComponent>}
                </InputComp>
                
              
                   
                <button type="submit"
                    disabled={Display}></button>
                
=======
                    {FormErr.DescriptionErr && <ErrorComponent Err={FormErr.deci}></ErrorComponent>}
                </InputComp>

                <button type="submit"
                    disabled={Display}></button>



>>>>>>> HaFiid
            </form>
            {SuccessMsg && <p>{SuccessMsg}</p>}
            {Err && <p>{Err}</p>}
        </>
    )
}

function InputComp({ onChange, name, label, type }) {

    return (
        <>
            {label && <label>{label}</label>}
            <input type={type}
                name={name}
                placeholder={name}
                value={value}
                onChange={onChange} />

        </>
    )
}

function ErrorComponent({ Err }) {
    return <p style={{ color: 'red' }}>{Err}</p>
}
"use client"

import { useState } from "react"
import styles from './CreateGroup.module.css';
import GroupCard from "./GroupCard";
import { object } from "zod";

export default function CreateGroupCard() {
    /* Testing the GroupCard WithDummyData
    -Still Need A cover Comp 
    -FetchPosts (and Post Feats) as Children*/
    const groupCardData = {
        groupName: "React Enthusiasts",
        description: "A community of developers passionate about building with React.",
        members:  [
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
  },
  {
    id: 4,
    name: "Emily Davis",
    picture: "https://randomuser.me/api/portraits/women/2.jpg"
  },
  {
    id: 5,
    name: "John Doe",
    picture: "https://randomuser.me/api/portraits/men/3.jpg"
  },
  {
    id: 6,
    name: "Sarah Lee",
    picture: "https://randomuser.me/api/portraits/women/3.jpg"
  },
  {
    id: 7,
    name: "Mark Fisher",
    picture: "https://randomuser.me/api/portraits/men/4.jpg"
  },
  {
    id: 8,
    name: "Jessica Taylor",
    picture: "https://randomuser.me/api/portraits/women/4.jpg"
  },
  {
    id: 9,
    name: "James Black",
    picture: null // No picture
  },
  {
    id: 10,
    name: "Chris Wright",
    picture: "https://randomuser.me/api/portraits/men/5.jpg"
  },
  {
    id: 11,
    name: "Olivia White",
    picture: "https://randomuser.me/api/portraits/women/5.jpg"
  },
  {
    id: 12,
    name: "Lucas Green",
    picture: "https://randomuser.me/api/portraits/men/6.jpg"
  },
  {
    id: 13,
    name: "Liam Scott",
    picture: "https://randomuser.me/api/portraits/men/7.jpg"
  },
  {
    id: 14,
    name: "Mia Moore",
    picture: "https://randomuser.me/api/portraits/women/6.jpg"
  },
  {
    id: 15,
    name: "Noah Adams",
    picture: "https://randomuser.me/api/portraits/men/8.jpg"
  },
  {
    id: 16,
    name: "Sophie Garcia",
    picture: "https://randomuser.me/api/portraits/women/7.jpg"
  },
  {
    id: 17,
    name: "Henry Martinez",
    picture: "https://randomuser.me/api/portraits/men/9.jpg"
  },
  {
    id: 18,
    name: "Amelia Clark",
    picture: null // No picture
  }
],
        children: <p>Join our next meetup on Friday!</p> ,//posts will be here
        srcImg: "https://media.licdn.com/dms/image/v2/D4D12AQF26-NZ279EaA/article-cover_image-shrink_600_2000/article-cover_image-shrink_600_2000/0/1688018102545?e=2147483647&v=beta&t=XMRwgTVSCknARngRO6R3_nFRrOX-BVxrpFLuwVX-SOA"
      };


    /* Create Group Logic Begin From Here 
    - Still Need to check if the user is Authenticated 
    - Make the InputComp Adjust size with props ( to make better visual UI)
    */
          const [Display, SetDisplay] = useState(false)
    // const[Title, SetTitle] = useState('')
    // const[Description, SetDescription] = useState('')
    // const[DescriptionErr, SetDescErr] = useState('')

    const [FormErr, SetFormErr] = useState({ DescriptionErr: null, TitleErr: null  , ImgErr : null})
    const [Err, SetErr] = useState(null)
    const [SuccessMsg, SetSuccesMsg] = useState(null)
    const [file , SetFile] = useState(null)
    const [formData, SetformData] = useState({ Description: '', Title: ''  , Image:file})
  const handleFileChange = (e) => {
    const Selectedfile = e.target.files[0]
    console.log(Selectedfile);
    if (!Selectedfile){
    SetFormErr(prevData =>({...prevData , ImgErr:null}))
    SetFile(null)
    return

      
    }
      const ImgExtension  = ['png', 'jpeg' ,'jpg']
      if (!Selectedfile.name.includes('.') ||
        Selectedfile.name.endsWith('.')    || 
        Selectedfile.name.startsWith('.')  ||
        Selectedfile.type.split('/')[0] !== 'image'){
        SetFormErr(prev => { return {...prev , ImgErr:`${file.name} is Not Valid Image`}})
        return 
      }
      if (!ImgExtension.includes(Selectedfile.name.slice(Selectedfile.name.lastIndexOf('.')+1))){
 SetFormErr(prev => { return {...prev , ImgErr:`${Selectedfile.name} Incompatible File try Image with png, jpeg and jpg extension`}})
        return 
      }
      if (Selectedfile.size > 1024*3000  ){
         SetFormErr(prev => { return {...prev , ImgErr:"Image size is too Big"}})
        return 
      }
   
              SetFormErr(prevData =>({...prevData , ImgErr:null}))

        SetFile(Selectedfile);
  SetformData(prev => ({ ...prev, Image: Selectedfile })); 

    };

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
        SetformData((prevData) => ({ ...prevData, [name]: value }))
    }

    function HandleDisplay() {
        SetDisplay(!Display)
    }
    async function handleSubmit(e) {
        e.preventDefault()
    
        if (formData.Description === '' || formData.Title === '' || FormErr.TitleErr !== null || FormErr.DescriptionErr !== null || FormErr.ImgErr !== null){
            console.log("here" , formData , FormErr);
            
            
            return
        }
        try {
        const data = new FormData()
  data.append('Description', formData.Description);
  data.append('Title', formData.Title);

  if (formData.Image) {
    console.log(formData.Image);
    data.append('Image', formData.Image); 
  }         
     const Resp = await fetch("http://localhost:8080/api/groups/", {
                method: "POST",
                credentials: 'include',
                body: data
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
      imgSrc={groupCardData.srcImg}
    >
      {/* {groupCardData.children} */}
    </GroupCard>  

        <h3 className={styles.heading3}>Create Group</h3>
        <form onSubmit={handleSubmit} className={styles.createGroupForm}>
    
                <InputComp
                  type="input"
                    name="Title"
                    placeholder="Enter Title"
                    label="Title"
                    onChange={HandleChange}
                />
                {FormErr.TitleErr &&  <ErrorComp Err={FormErr.TitleErr}></ErrorComp>}


                <InputComp
                    type="input"
                    name="Description"
                    placeholder="Enter Description"
                    label="Description"
                    onChange={HandleChange}
                />
                {FormErr.DescriptionErr && <ErrorComp Err={FormErr.DescriptionErr}></ErrorComp> }

           <UploadInput name="cover"
           handleFileChange={handleFileChange}
           fileName={file ? file.name : ""}
           >

           </UploadInput>
                {FormErr.ImgErr && <ErrorComp Err={FormErr.ImgErr}></ErrorComp> }
      
            <button type="submit" className={styles.submitBtn} disabled={false}>
                Create Group
            </button>

            {SuccessMsg && <p className={styles.successMessage}>{SuccessMsg}</p>}
            {Err && <ErrorComp Err={Err}></ErrorComp>}
        </form>



  </div>
      
      
    )

}



function InputComp({ onChange, name, label, type }) {

    return (
        <div className={styles.formGroup}>
            <label className={styles.label} htmlFor={name}>{label}</label>
            <input
                type={type}
                className={styles.inputText}
                name={name}
                placeholder={label}
                onChange={onChange}
            />
        </div>
    );
  }
function ErrorComp({Err}){
    return  <p className={styles.serverError}>{Err}</p>
}


function UploadInput({name , handleFileChange , fileName}){
  return (
    <div className={styles.fileUploadWrapper}>
      
        <label htmlFor={name} className={styles.fileUploadLabel}>
                    {fileName || "Upload A Cover"}
                    <input
                        id={name}
                        type="file"
                        name={name}
                        onChange={handleFileChange}
                        className={styles.fileInputHidden}
                    />
                </label>
     {fileName && <span className={styles.fileNameDisplay}>{fileName}</span>}

    </div>
  )
}
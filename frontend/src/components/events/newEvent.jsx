'use client';

import { useState } from 'react';
import styles from "@/components/events/newEvent.module.css";
import { useParams } from "next/navigation";

export default function ShowEventForm() {
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        day: "",
        time: "",
        date: "",
        location: "",
    });
    const [errors, setErrors] = useState({});
    const [serverError, setServerError] = useState('')

    const p = useParams()
    const groupId = p.id
    console.log("===================groupId:", groupId);

    const handleClick = () => {
        setShowForm(!showForm);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Reset the error message for the specific field when the user changes it
        setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.title || formData.title.trim() === "" || formData.title.length < 10 || formData.title.length > 100) {
            newErrors.title = "Title is required.";
        }

        if (!formData.description || formData.description.trim() === "" || formData.description.length < 30 || formData.description.length > 250) {
            newErrors.description = "Description is required.";
        }

        if (!formData.day || formData.day.trim() === "") {
            newErrors.day = "Event day is required.";
        } else {
            const selectedDate = new Date(formData.day);
            const currentDate = new Date();

            if (selectedDate <= currentDate) {
                newErrors.day = "Event date must be in the future.";
            }
        }

        if (!formData.time || formData.time.trim() === "") {
            newErrors.time = "Event time is required.";
        }

        formData.date = formData.day + " " + formData.time

        if (!formData.location || formData.location.trim() === "" || formData.location.length < 5 || formData.location.length > 30) {
            newErrors.location = "Event location is required.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0; // returns true if no errors
    };
    const closePopup = () => {
        setShowForm(false);
    };

    const getFormData = (e) => {
        e.preventDefault();

        // Validate form before submission
        const isValid = validateForm();
        if (!isValid) {
            return; // Don't submit the form if there are errors
        }



        SendEventForm(formData, groupId)

        setFormData({ title: "", description: "", day: "", time: "", date: "", location: "" });
        handleClick()
    };

    return (
        <div className={styles.CreateEvent}>
            <button id="showEventForm" onClick={handleClick}>
                {showForm ? "" : 'Create Event'}
            </button>

            {showForm && (
                <div className={styles.popupOverlay}>
                    <form onSubmit={getFormData} className={styles.popupContent}>
                        {<span className={styles.closeButton} onClick={closePopup}>&times;</span>}
                        {<h2>Create Event</h2>}
                        <div className={styles.labelContainer}>
                            <label htmlFor="title" className={styles.label}>Title:</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                            />
                            {errors.title && <p className={styles.error}>{errors.title}</p>}
                        </div>

                        <div className={styles.labelContainer}>
                            <label htmlFor="description" className={styles.label}>Description:</label>
                            <input
                                type="text"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                            />
                            {errors.description && <p className={styles.error}>{errors.description}</p>}
                        </div>

                        <div className={styles.labelContainer}>
                            <label className={styles.label}>Select Event Day:</label>
                            <input
                                type="date"
                                name="day"
                                value={formData.day}
                                onChange={handleChange}
                                className={styles.eventDate}
                            />
                            {errors.date && <p className={styles.error}>{errors.date}</p>}
                        </div>
                        <div className={styles.labelContainer}>
                            <label className={styles.label}>Select Event Time:</label>
                            <input
                                type="time"
                                name="time"
                                value={formData.time}
                                onChange={handleChange}
                                className={styles.eventTime}
                            />
                            {errors.time && <p className={styles.error}>{errors.time}</p>}
                        </div>
                        <div className={styles.labelContainer}>
                            <label className={styles.label}>Location:</label>
                            <input
                                type="text"
                                name="location"
                                placeholder="Enter event location"
                                value={formData.location}
                                onChange={handleChange}
                                className={styles.eventTime}
                            />
                            {errors.location && <p className={styles.error}>{errors.location}</p>}
                        </div>

                        <button type="submit" >Create Event</button>
                    </form>
                </div>
            )}
        </div>
    );
}


function SendEventForm(formData, groupId) {
    // Last version --> /groups/{id}/newEvent


    fetch(`http://localhost:8080/api/groups/${groupId}/newEvent`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        credentials: 'include'

    })
        .then((res) => {
            if (!res.ok) {
                return res.json().then(errData => {
                    throw new Error(errData.error || "Event fetch failed");
                });
            }
            return res.json();
        })
        .then((data) => {
            // setServerError("");
            console.log("Event created:", data);
        })
        .catch((error) => {
            console.error("Error creating event:", error);
            // setServerError(error.message)
        });
}   
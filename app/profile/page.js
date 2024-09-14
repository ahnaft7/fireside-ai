"use client"
import React, { useState, useEffect } from 'react';
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { PlusCircle, Send, Pencil, Trash2 } from "lucide-react";
import { db } from "@/firebase";
import { doc, collection, setDoc, getDoc } from "firebase/firestore";
import Link from 'next/link'

export default function Profile() {
    const { isLoaded, isSignedIn, user } = useUser()
    const [experiences, setExperiences] = useState([]);
    const [education, setEducation] = useState({
        highestEducation: '',
        certifications: '',
    });
    const [careerGoals, setCareerGoals] = useState({
        goals: '',
        visionIn5Years: '',
    });
    const [skills, setSkills] = useState({
        topSkills: '',
        strengthsAndAreas: '',
    });
    const [additionalInfo, setAdditionalInfo] = useState({
        otherInfo: '',
    });
    
    const [open, setOpen] = React.useState(false);
    const [currentlyWorking, setCurrentlyWorking] = useState(false);
    const [editIndex, setEditIndex] = useState(null);
    const [currentExperience, setCurrentExperience] = useState({});
    const router = useRouter()

    useEffect(() => {
        if (isLoaded && isSignedIn) {
            fetchUserProfile(); // Fetch user profile data if signed in
        } else if (isLoaded && !isSignedIn) {
            router.push('/sign-in'); // Redirect to sign-in page if not signed in
        }
    }, [isLoaded, isSignedIn, router])

    const fetchUserProfile = async () => {
        const userDocRef = doc(collection(db, 'users'), user.id);
        try {
            const docSnap = await getDoc(userDocRef);
            if (docSnap.exists()) {
                const data = docSnap.data();
                setExperiences(data.experiences || []);
                setEducation(data.education || {
                    highestEducation: '',
                    certifications: '',
                });
                setCareerGoals(data.careerGoals || {
                    goals: '',
                    visionIn5Years: '',
                });
                setSkills(data.skills || {
                    topSkills: '',
                    strengthsAndAreas: '',
                });
                setAdditionalInfo(data.additionalInfo || {
                    otherInfo: '',
                });
            }
        } catch (error) {
            console.error('Error fetching user profile:', error);
        }
    };

    if (!isLoaded || !isSignedIn) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-orange-200 text-center" style={{ backgroundColor: "#2A2A2A" }}>
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-orange-200"></div>
                <h2 className="mt-4 text-xl">Loading your profile...</h2>
            </div>
        );
    }

    const handleCheckboxChange = (event) => {
        setCurrentlyWorking(event.target.checked);
    };

    const handleClickOpen = () => {
        setEditIndex(null);
        setCurrentlyWorking(false);
        setCurrentExperience({});
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const addExperience = (experience) => {
        if (editIndex !== null) {
            const updatedExperiences = experiences.map((exp, index) =>
                index === editIndex ? { ...experience, currentlyWorking } : exp
            );
            setExperiences(updatedExperiences);
        } else {
            setExperiences([...experiences, { ...experience, currentlyWorking }]);
        }
        handleClose(); // Close the dialog after adding/updating
        setCurrentExperience({}); // Clear the current experience state
        setEditIndex(null); // Reset edit index
    };

    const handleEdit = (index) => {
        setEditIndex(index);
        const experience = experiences[index];
        setCurrentExperience(experience);
        setCurrentlyWorking(experience.currentlyWorking);
        setOpen(true);
    };

    const handleDelete = (index) => {
        if (index >= 0 && index < experiences.length) {
            setExperiences(experiences.filter((_, i) => i !== index));
        }
    };

    const saveProfile = async () => {
        if (!user || !user.id) {
            console.error('User not found or user ID is missing.');
            return;
        }
    
        const userDocRef = doc(db, 'users', user.id);
    
        try {
            await setDoc(userDocRef, {
                experiences,
                education,
                careerGoals,
                skills,
                additionalInfo
            }, { merge: true });
    
            console.log('Profile updated successfully.');
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Error updating profile.');
        }
    };

    const submitData = async () => {
        if (!user || !user.id) {
            console.error('User not found or user ID is missing.');
            return;
        }
        // Create an object with profile data and userId
        const profileData = {
            userId: user.id,
            experiences,
            education,
            careerGoals,
            skills,
            additionalInfo
        };
    
        // try {
        //     const response = await fetch('/api/generate', {
        //         method: 'POST',
        //         headers: {
        //             'Content-Type': 'application/json',
        //         },
        //         body: JSON.stringify(profileData), // Send all profile data and userId
        //     });
    
        //     if (!response.ok) {
        //         console.error('Failed to fetch data');
        //         alert('Error submitting flashcards.');
        //         return;
        //     }
    
        //     const data = await response.json();
        //     console.log(data); // Process the response data as needed
        // } catch (error) {
        //     console.error('Error:', error);
        //     alert('Error.');
        // }
    };

    const handleSaveClick = async () => {
        try {
            await saveProfile(); // Wait for profile to be saved
            await submitData();  // Wait for submission after profile is saved
            alert('Profile updated!');
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Error updating profile.');
        }
    };
    
    

    return (
        <div className="w-full p-4 bg-gray-900 min-h-screen" style={{ backgroundColor: "#2A2A2A" }}>
            <div className="max-w-screen-lg mx-auto pt-8">
                <Card className="mt-4 bg-gray-800" style={{ backgroundColor: "#2A2A2A" }}>
                    <CardHeader>
                        <CardTitle className="text-4xl font-bold text-center text-orange-200">Your Profile</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={async (event) => {
                            event.preventDefault(); // Prevent default form submission behavior
                            console.log('Form submit event triggered');
                            await handleSaveClick(); // Call the save and submit functions
                        }}>
                            <ProfileSection title="Education">
                                <CustomInput
                                    label="Highest level of education and field of study"
                                    placeholder="e.g., Bachelor's in Computer Science"
                                    value={education.highestEducation}
                                    onChange={(e) => setEducation({ ...education, highestEducation: e.target.value })}
                                />
                                <CustomInput
                                    label="Relevant certifications"
                                    placeholder="e.g., AWS Certified Solutions Architect"
                                    value={education.certifications}
                                    onChange={(e) => setEducation({ ...education, certifications: e.target.value })}
                                />
                            </ProfileSection>

                            <ProfileSection title="Work Experience">
                                <p className="text-orange-200">Add your relevant work experiences below:</p>
                                {experiences.map((exp, index) => (
                                    <Card key={index} className="mb-4 bg-gray-700">
                                        <CardContent className="p-4">
                                            <p className="text-white">{exp.Company} - {exp.Position}</p>
                                            <p className="text-gray-300">{exp['Start Date']} - {exp.currentlyWorking ? 'Present' : exp['End Date']}</p>
                                            <div className="mt-2 flex items-center gap-2">
                                                <Button variant="outline" type="button" size="sm" onClick={() => handleEdit(index)}>
                                                    <Pencil className="mr-2 h-4 w-4" /> Edit
                                                </Button>
                                                <Button variant="outline" type="button" size="sm" onClick={() => handleDelete(index)}>
                                                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                                <Dialog open={open} onOpenChange={setOpen}>
                                    <DialogTrigger asChild>
                                        <Button variant="outline">
                                            <PlusCircle className="mr-2 h-4 w-4" /> Add Work Experience
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Work Experience</DialogTitle>
                                            <DialogDescription>
                                                Add your work experience here. Be as detailed as possible in your descriptions.
                                            </DialogDescription>
                                        </DialogHeader>
                                        <form onSubmit={(event) => {
                                            event.preventDefault();
                                            event.stopPropagation(); // Prevent the event from bubbling up to parent forms
                                            const formData = new FormData(event.currentTarget);
                                            const formJson = Object.fromEntries(formData.entries());
                                            addExperience(formJson);
                                        }}>
                                            <div className="grid gap-4 py-4">
                                                <CustomInput
                                                    name="Company"
                                                    label="Company Name"
                                                    defaultValue={currentExperience.Company || ''}
                                                    required
                                                />
                                                <CustomInput
                                                    name="Position"
                                                    label="Position"
                                                    defaultValue={currentExperience.Position || ''}
                                                    required
                                                />
                                                <CustomInput
                                                    name="Start Date"
                                                    label="Start Date"
                                                    type="date"
                                                    defaultValue={currentExperience['Start Date'] || ''}
                                                    required
                                                />
                                                {!currentlyWorking && (
                                                    <CustomInput
                                                        name="End Date"
                                                        label="End Date"
                                                        type="date"
                                                        defaultValue={currentExperience['End Date'] || ''}
                                                    />
                                                )}
                                                <div className="flex items-center space-x-2">
                                                    <Checkbox
                                                        id="currentlyWorking"
                                                        checked={currentlyWorking}
                                                        onCheckedChange={setCurrentlyWorking}
                                                    />
                                                    <Label htmlFor="currentlyWorking">Currently Working Here</Label>
                                                </div>
                                                <Textarea
                                                    name="Description"
                                                    placeholder="Description"
                                                    defaultValue={currentExperience.Description || ''}
                                                />
                                                <Textarea
                                                    name="Personal Experience"
                                                    placeholder="Personal Experience"
                                                    defaultValue={currentExperience['Personal Experience'] || ''}
                                                />
                                                <CustomInput
                                                    name="Skills"
                                                    label="Skills Used/Learned"
                                                    defaultValue={currentExperience.Skills || ''}
                                                />
                                            </div>
                                            <DialogFooter>
                                                <Button type="submit">Save Experience</Button>
                                            </DialogFooter>
                                        </form>
                                    </DialogContent>
                                </Dialog>
                            </ProfileSection>

                            <ProfileSection title="Career Goals">
                                <CustomInput
                                    label="Short-term and long-term goals"
                                    placeholder="Describe your career aspirations"
                                    value={careerGoals.goals}
                                    onChange={(e) => setCareerGoals({ ...careerGoals, goals: e.target.value })}
                                />
                                <CustomInput
                                    label="Where do you see yourself in 5 years?"
                                    placeholder="Your future vision"
                                    value={careerGoals.visionIn5Years}
                                    onChange={(e) => setCareerGoals({ ...careerGoals, visionIn5Years: e.target.value })}
                                />
                            </ProfileSection>

                            <ProfileSection title="Skills">
                                <CustomInput
                                    label="Top three professional skills"
                                    placeholder="e.g., Leadership, Problem-solving, Python"
                                    value={skills.topSkills}
                                    onChange={(e) => setSkills({ ...skills, topSkills: e.target.value })}
                                />
                                <CustomInput
                                    label="Strengths and areas to improve"
                                    placeholder="Professional strengths and development areas"
                                    value={skills.strengthsAndAreas}
                                    onChange={(e) => setSkills({ ...skills, strengthsAndAreas: e.target.value })}
                                />
                            </ProfileSection>

                            <ProfileSection title="Additional Information">
                                <CustomInput
                                    label="Anything else you'd like to add"
                                    placeholder="Other relevant information"
                                    value={additionalInfo.otherInfo}
                                    onChange={(e) => setAdditionalInfo({ ...additionalInfo, otherInfo: e.target.value })}
                                />
                            </ProfileSection>

                            <Button
                                type="submit"
                                className="mt-8 bg-orange-200 text-black hover:bg-orange-300"
                            >
                                <Send className="mr-2 h-4 w-4" /> Update Profile
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

const ProfileSection = ({ title, children }) => (
    <div className="space-y-4">
        <h3 className="text-2xl font-bold text-orange-200 underline">{title}</h3>
        {children}
    </div>
);

const CustomInput = ({ label, ...props }) => (
    <div className="space-y-2">
        <Label htmlFor={props.name} className="text-orange-200">{label}</Label>
        <Input id={props.name} className="bg-gray-700 text-white border-orange-200" {...props} />
    </div>
);
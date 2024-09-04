"use client"
import * as React from 'react';
import { useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { Box, Button, Container, TextField, Typography, Paper, Grid, Fade, AppBar, Toolbar, CircularProgress, FormControlLabel, Checkbox } from "@mui/material";
import { useState, useEffect } from "react";
import AddIcon from '@mui/icons-material/Add';
import SendIcon from '@mui/icons-material/Send';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
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
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '100vh',
                    backgroundColor: '#2E2E2E',
                    color: '#FCD19C',
                    textAlign: 'center'
                }}
            >
                <CircularProgress sx={{ color: '#FCD19C', mb: 2 }} />
                <Typography variant="h6" sx={{ color: '#FCD19C' }}>
                    Loading your profile...
                </Typography>
            </Box>
        )
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
        handleClose();
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
        // if (!user || !user.id) return;

        const userDocRef = doc(collection(db, 'users'), user.id);

        try {
            await setDoc(userDocRef, {
                experiences,
                education,
                careerGoals,
                skills,
                additionalInfo
            }, { merge: true });
            
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Error updating profile.');
        }
    };

    const submitData = async () => {
        if (!user || !user.id) return;
    
        // Create an object with profile data and userId
        const profileData = {
            userId: user.id,
            experiences,
            education,
            careerGoals,
            skills,
            additionalInfo
        };
    
        try {
            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(profileData), // Send all profile data and userId
            });
    
            if (!response.ok) {
                console.error('Failed to fetch data');
                alert('Error submitting flashcards.');
                return;
            }
    
            const data = await response.json();
            console.log(data); // Process the response data as needed
        } catch (error) {
            console.error('Error:', error);
            alert('Error.');
        }
    };
    

    return (
        <Container maxWidth="100%" sx={{ backgroundColor: '#2E2E2E', minHeight: '100vh', p: 0 }}>
            <Fade in={true} timeout={1000}>
                <Paper elevation={3} sx={{ p: 4, mt: 4, borderRadius: 2, backgroundColor: '#1C1C1C' }}>
                    <Typography variant="h2" align="center" gutterBottom sx={{ fontWeight: 'bold', color: '#FCD19C' }}>
                        Your Profile
                    </Typography>
                    <form>
                        <Grid container spacing={4}>
                            <ProfileSection title="Education">
                                <CustomTextField
                                    label="Highest level of education and field of study"
                                    placeholder="e.g., Bachelor's in Computer Science"
                                    fullWidth
                                    variant="outlined"
                                    margin="normal"
                                    value={education.highestEducation}
                                    onChange={(e) => setEducation({ ...education, highestEducation: e.target.value })
                                    }
                                />
                                <CustomTextField
                                    label="Relevant certifications"
                                    placeholder="e.g., AWS Certified Solutions Architect"
                                    fullWidth
                                    variant="outlined"
                                    margin="normal"
                                    value={education.certifications}
                                    onChange={(e) => setEducation({ ...education, certifications: e.target.value })}
                                />
                            </ProfileSection>

                            <ProfileSection title="Work Experience">
                                <Typography variant="body1" gutterBottom sx={{ color: '#FCD19C' }}>
                                    Add your relevant work experiences below:
                                </Typography>
                                {experiences.map((exp, index) => (
                                    <Box key={index} sx={{ mb: 2, p: 2, border: '1px solid #FCD19C', borderRadius: 2, backgroundColor: '#333' }}>
                                        <Typography variant="body1" sx={{ color: '#fff' }}>
                                            {exp.Company} - {exp.Position}
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: '#ccc' }}>
                                            {exp['Start Date']} - {exp.currentlyWorking ? 'Present' : exp['End Date']}
                                        </Typography>
                                        <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Button
                                                onClick={() => handleEdit(index)}
                                                sx={{ color: '#FCD19C' }}
                                                startIcon={<EditIcon />}
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                onClick={() => handleDelete(index)}
                                                sx={{ color: '#FCD19C' }}
                                                startIcon={<DeleteIcon />}
                                            >
                                                Delete
                                            </Button>
                                        </Box>
                                    </Box>
                                ))}
                                <Button
                                    variant="outlined"
                                    startIcon={<AddIcon />}
                                    onClick={handleClickOpen}
                                    sx={{ mt: 2, borderColor: '#FCD19C', color: '#FCD19C' }}
                                >
                                    Add Work Experience
                                </Button>
                                <Dialog
                                    open={open}
                                    onClose={handleClose}
                                    PaperProps={{
                                        component: 'form',
                                        onSubmit: (event) => {
                                            event.preventDefault();
                                            const formData = new FormData(event.currentTarget);
                                            const formJson = Object.fromEntries(formData.entries());
                                            addExperience(formJson);
                                        },
                                    }}
                                >
                                    <DialogTitle>Work Experience</DialogTitle>
                                    <DialogContent>
                                        <DialogContentText>
                                            Add your work experience here. Be as detailed as possible in your descriptions.
                                        </DialogContentText>
                                        <TextField
                                            autoFocus
                                            required
                                            margin="dense"
                                            id="company-name"
                                            name="Company"
                                            label="Company Name"
                                            type="text"
                                            fullWidth
                                            variant="standard"
                                            defaultValue={currentExperience.Company || ''}
                                        />
                                        <TextField
                                            required
                                            margin="dense"
                                            id="position"
                                            name="Position"
                                            label="Position"
                                            type="text"
                                            fullWidth
                                            variant="standard"
                                            defaultValue={currentExperience.Position || ''}
                                        />
                                        <TextField
                                            required
                                            margin="dense"
                                            id="start-date"
                                            name="Start Date"
                                            label="Start Date"
                                            type="date"
                                            fullWidth
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                            variant="standard"
                                            defaultValue={currentExperience['Start Date'] || ''}
                                        />
                                        {!currentlyWorking && (
                                            <TextField
                                                margin="dense"
                                                id="end-date"
                                                name="End Date"
                                                label="End Date"
                                                type="date"
                                                fullWidth
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                                variant="standard"
                                                defaultValue={currentExperience['End Date'] || ''}
                                            />
                                        )}
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={currentlyWorking}
                                                    onChange={handleCheckboxChange}
                                                    name="currentlyWorking"
                                                    color="primary"
                                                />
                                            }
                                            label="Currently Working Here"
                                        />
                                        <TextField
                                            margin="dense"
                                            id="description"
                                            name="Description"
                                            label="Description"
                                            type="text"
                                            fullWidth
                                            multiline
                                            rows={4}
                                            variant="standard"
                                            defaultValue={currentExperience.Description || ''}
                                        />
                                        <TextField
                                            margin="dense"
                                            id="personal-experience"
                                            name="Personal Experience"
                                            label="Personal Experience"
                                            type="text"
                                            fullWidth
                                            multiline
                                            rows={4}
                                            variant="standard"
                                            defaultValue={currentExperience['Personal Experience'] || ''}
                                        />
                                        <TextField
                                            margin="dense"
                                            id="skills"
                                            name="Skills"
                                            label="Skills Used/Learned"
                                            type="text"
                                            fullWidth
                                            multiline
                                            rows={2}
                                            variant="standard"
                                            defaultValue={currentExperience.Skills || ''}
                                        />
                                    </DialogContent>
                                    <DialogActions>
                                        <Button onClick={handleClose}>Cancel</Button>
                                        <Button type="submit">Save Experience</Button>
                                    </DialogActions>
                                </Dialog>
                            </ProfileSection>

                            <ProfileSection title="Career Goals">
                                <CustomTextField
                                    label="Short-term and long-term goals"
                                    placeholder="Describe your career aspirations"
                                    fullWidth
                                    variant="outlined"
                                    margin="normal"
                                    value={careerGoals.goals}
                                    onChange={(e) => setCareerGoals({ ...careerGoals, goals: e.target.value })}
                                />
                                <CustomTextField
                                    label="Where do you see yourself in 5 years?"
                                    placeholder="Your future vision"
                                    fullWidth
                                    variant="outlined"
                                    margin="normal"
                                    value={careerGoals.visionIn5Years}
                                    onChange={(e) => setCareerGoals({ ...careerGoals, visionIn5Years: e.target.value })}
                                />
                            </ProfileSection>

                            <ProfileSection title="Skills">
                                <CustomTextField
                                    label="Top three professional skills"
                                    placeholder="e.g., Leadership, Problem-solving, Python"
                                    fullWidth
                                    variant="outlined"
                                    margin="normal"
                                    value={skills.topSkills}
                                    onChange={(e) => setSkills({ ...skills, topSkills: e.target.value })}
                                />
                                <CustomTextField
                                    label="Strengths and areas to improve"
                                    placeholder="Professional strengths and development areas"
                                    fullWidth
                                    variant="outlined"
                                    margin="normal"
                                    value={skills.strengthsAndAreas}
                                    onChange={(e) => setSkills({ ...skills, strengthsAndAreas: e.target.value })}
                                />
                            </ProfileSection>

                            <ProfileSection title="Additional Information">
                                <CustomTextField
                                    label="Anything else you'd like to add"
                                    placeholder="Other relevant information"
                                    fullWidth
                                    variant="outlined"
                                    margin="normal"
                                    value={additionalInfo.otherInfo}
                                    onChange={(e) => setAdditionalInfo({ ...additionalInfo, otherInfo: e.target.value })}
                                />
                            </ProfileSection>
                        </Grid>

                        <Button
                            variant="outlined"
                            endIcon={<SendIcon />}
                            sx={{
                                mt: 4,
                                backgroundColor: '#FCD19C',
                                color: "#000",
                                ":hover": {backgroundColor: '#e0a44d',}
                            }}
                            onClick={() => {
                                saveProfile();
                                submitData();
                                alert('Profile updated!');
                            }}
                        >
                            Update Profile
                        </Button>
                    </form>
                </Paper>
            </Fade>
        </Container>
    );
}

const ProfileSection = ({ title, children }) => (
    <Grid item xs={12}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#FCD19C', mb: 2, textDecoration: 'underline' }}>
            {title}
        </Typography>
        {children}
    </Grid>
);

const CustomTextField = ({ label, placeholder, value, onChange }) => (
    <TextField
        fullWidth
        variant="outlined"
        label={label}
        placeholder={placeholder}
        multiline
        rows={2}
        margin="normal"
        value={value}
        onChange={onChange}
        sx={{
            backgroundColor: '#333',
            color: '#FCD19C', 
            '& .MuiOutlinedInput-root': {
                '& fieldset': {
                    borderColor: '#FCD19C', 
                },
                '&:hover fieldset': {
                    borderColor: '#fff', 
                },
                '&.Mui-focused fieldset': {
                    borderColor: '#fff', 
                },
                '& .MuiInputBase-input': {
                    color: '#fff', 
                },
                '& .MuiInputBase-input::placeholder': {
                    color: '#fff', 
                },
            },
            '& .MuiInputLabel-root': {
                color: '#FCD19C', 
            },
            '& .MuiInputLabel-root.Mui-focused': {
                color: '#FCD19C', 
            },
        }}
    />
);
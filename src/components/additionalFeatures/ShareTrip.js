import * as React from 'react';
import { Container, Avatar } from '@mui/material';
import { Typography, Grid, Divider, Select, OutlinedInput, InputLabel, TextField } from '@mui/material';
import { MenuItem, Button, Autocomplete } from '@mui/material';
import { useUserContext } from '../../hooks/useUserContext';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FormControl from '@mui/material/FormControl';
import axios from 'axios';


function ShareTrip ({handleShareTripDialog}) {
    const {user, updateUser} = useUserContext();
    const [userList, setUserList] = React.useState([]);
    const [userToAdd, setUserToAdd] = React.useState({});
    const [userLastAdded, setUserLastAdded] = React.useState({});
    const [addedUsers, setAddedUsers] = React.useState([]);
    const [usersWithAccess, setUsersWithAccess] = React.useState([]);
    const [addButtonClicked, setAddButtonClicked] = React.useState(false);
    const [showAddButton, setShowAddButton] = React.useState(false);

    React.useEffect(() => {
        const fetchData = async () => {
            await axios.get(`/api/user/getAllUsers`) 
            .then((res) => {
                setUserList(res.data);
                setUserList(userList => userList.filter(userOnList => userOnList.email !== user.email));
                for (let i = 0; i < userList.length; i++) {
                    userList[i].permission = 3;
                }
            })
            .catch((err) => {
                console.log(err);
            });
        }
        fetchData();
    }, []);

    
    const handlePermissionChange = (event, selectedUser) => {
        if (event.target.value === 3) {
            const updatedUsers = addedUsers.filter((user) => user.email !== selectedUser.email);
            setAddedUsers(updatedUsers);
            const updatedUsersAccess = usersWithAccess.filter((user) => user.email !== selectedUser.email);
            setUsersWithAccess(updatedUsersAccess);
            if (selectedUser.email === userToAdd.email) {
                setShowAddButton(true);
            }
        } else {
            const updatedUsers = addedUsers.map((user) =>
            user.email === selectedUser.email ? { ...user, permission: event.target.value } : user
            );
            setAddedUsers(updatedUsers);
        }
    };
    
    const handleAddButtonClick = () => {
        setAddButtonClicked(true);
    }

    const handleShowAddButton = (user) => {
        const userAlreadyAdded = addedUsers.some((existingUser) => existingUser.email === user.email);
        const userAlreadyHasAccess = usersWithAccess.some((existingUser) => existingUser.email === user.email);

        if (userAlreadyAdded || userAlreadyHasAccess) {
            setShowAddButton(false);
        } else {
            setShowAddButton(true);
        }
    }
    
    const handleShareButton = () => {
        setUsersWithAccess(prevUsers => [...prevUsers, ...addedUsers]);
        setAddedUsers([]);
    }

    const handleCancelButton = () => {
        setAddedUsers([]);
        setUserToAdd({});
        handleShareTripDialog();
    }

    React.useEffect(() => {
        if (addButtonClicked) {
            setAddedUsers(prevUsers => [...prevUsers, userToAdd]);
            setUserLastAdded(userToAdd);
            setUserToAdd({});
            setAddButtonClicked(false);
            setShowAddButton(false);
        }
    }, [addButtonClicked]);


    return (
        <div style={{ textAlign: 'left' }}>
            <Typography style={{ fontSize: '25px' }}>Share Trip</Typography>
            <br></br>
            <Container>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={10} sm={10} md={10} alignItems="center">
                        <Autocomplete
                            id="shareToAutocomplete"
                            options={userList}
                            getOptionLabel={(user) => user.email}
                            renderOption={(props, user) => {
                                return (
                                <li {...props} style={{ display: 'flex', alignItems: 'center'}}  
                                >
                                    <Avatar src={user.profile_picture} alt="Profile" />
                                    <div style={{ marginLeft: '10px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                                    <Typography sx={{ fontSize: '15px' }}>{user.name}</Typography>
                                    <Typography sx={{ fontSize: '12px', color: 'gray' }}>{user.email}</Typography>
                                    </div>
                              </li>
                            )}}
                            filterOptions={(users, { inputValue }) =>
                                users.filter((user) =>
                                    !addedUsers.some((addedUser) => addedUser.email === user.email) &&
                                    user.email.toLowerCase().includes(inputValue.toLowerCase())
                                )
                            }
                            onChange={(newInputValue, user) => {
                                setUserToAdd({
                                    email: user.email,
                                    name: user.name,
                                    profile_picture: user.profile_picture,
                                    permission: 1
                                });
                                handleShowAddButton(user);
                            }}
                            renderInput={(params) => {
                                params.inputProps.value = userToAdd.email ? userToAdd.email : "";
                            
                                return (
                                    <TextField
                                        {...params}
                                        label="Add people"
                                        variant="outlined"
                                        fullWidth
                                    />
                                );
                            }}
                        />
                    </Grid>
                    <Grid item xs={2} sm={2} md={2}>
                        {showAddButton ? (
                            <Button
                            sx={{
                                borderRadius: '10px',
                                border: '1px solid #ccc',
                                boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',
                                backgroundColor: 'darkblue',
                                color: 'white',
                                '&:hover': {
                                    backgroundColor: '#6495ed',
                                },
                            }}
                            onClick={handleAddButtonClick}
                            >
                                Add
                            </Button>
                        ) : (
                            <Typography/>
                        )}
                    </Grid>
                </Grid>
                <Typography sx={{ fontWeight: 'bold', marginTop: '3%', marginBottom: '3%' }}>People with Access:</Typography>
                <Grid container style={{ marginBottom: '3%' }}>
                    <Grid item xs={9} sm={9} md={9}>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1%' }}>
                        <Avatar src={user.profile_picture} alt="Profile" />
                        <div style={{ marginLeft: '10px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                            <Typography sx={{ fontSize: '15px' }}>{user.name} (you)</Typography>
                            <Typography sx={{ fontSize: '12px', color: 'grey' }}>{user.email}</Typography>
                        </div>
                        </div>
                    </Grid>
                    <Grid item xs={3} sm={3} md={3}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', height: '100%' }}>
                        <Typography sx={{ color: 'gray'}}>Owner</Typography>
                        </div>
                    </Grid>
                </Grid>
                {[...usersWithAccess, ...addedUsers].map((user, index) => (
                    <Grid container style={{ marginBottom: '3%'}} key={index}>
                        <Grid item xs={9} sm={9} md={9}>
                            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1%' }}>
                            <Avatar src={user.profile_picture} alt="Profile" />
                            <div style={{ marginLeft: '10px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                                <Typography sx={{ fontSize: '15px' }}>{user.name}</Typography>
                                <Typography sx={{ fontSize: '12px', color: 'grey' }}>{user.email}</Typography>
                            </div>
                            </div>
                        </Grid>
                        <Grid item xs={3} sm={3} md={3}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', height: '100%' }}>
                                <FormControl fullWidth variant="standard" sx={{ width: '80%' }}>
                                    <Select
                                        labelId={`permission-label-${user.email}`}
                                        id={`permission-select-${user.email}`}
                                        value={user.permission}
                                        onChange={(event) => handlePermissionChange(event, user)}
                                        sx={{
                                            '&:hover': {
                                                backgroundColor: 'rgba(0, 0, 0, 0.1)', // Set the desired background color on hover
                                            },
                                            textAlign: 'center',
                                        }}
                                    >
                                        <MenuItem value={1}>Viewer</MenuItem>
                                        <MenuItem value={2}>Editor</MenuItem>
                                        <Divider/>
                                        <MenuItem value={3}>Remove Access</MenuItem>
                                    </Select>
                                </FormControl>
                            </div>
                        </Grid>
                    </Grid>
                ))}
            </Container>
            <Container style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '3%' }}>
                <Button
                    sx={{
                        borderRadius: '10px',
                        border: '1px solid #ccc',
                        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',
                        backgroundColor: 'darkblue',
                        color: 'white',
                        '&:hover': {
                            backgroundColor: '#6495ed',
                        },
                        fontSize: '12px',
                        width: '15%'
                    }}
                    onClick={handleCancelButton}
                >
                    Cancel
                </Button>
                <Button
                    sx={{
                        borderRadius: '10px',
                        border: '1px solid #ccc',
                        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',
                        backgroundColor: 'darkblue',
                        color: 'white',
                        '&:hover': {
                            backgroundColor: '#6495ed',
                        },
                        fontSize: '12px',
                        width: '15%'
                    }}
                    onClick={handleShareButton}
                >
                    Share
                </Button>
            </Container>
        </div>
    )
}

export default ShareTrip;

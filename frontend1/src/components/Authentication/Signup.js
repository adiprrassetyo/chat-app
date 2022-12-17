import React, { useState } from "react";
import { Button } from "@chakra-ui/button";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input";
import { VStack } from "@chakra-ui/layout";
import {
	getStorage,
	ref,
	uploadBytesResumable,
	getDownloadURL,
} from "firebase/storage";
import app from "../../firebase";
import { useToast } from "@chakra-ui/toast";
import { useHistory } from "react-router";
import axios from "axios";

const Signup = () => {
	const toast = useToast();
	const history = useHistory();
	const [show, setShow] = useState(false);
	const handleClick = () => setShow(!show);
	const [name, setName] = useState();
	const [email, setEmail] = useState();
	const [confirmpassword, setConfirmpassword] = useState();
	const [password, setPassword] = useState();
	const [pic, setPic] = useState();

	const [picLoading, setPicLoading] = useState(false);

	const submitHandler = async () => {
		setPicLoading(true);
		if (!name || !email || !password || !confirmpassword) {
			toast({
				title: "Please Fill all the Feilds",
				status: "warning",
				duration: 5000,
				isClosable: true,
				position: "bottom",
			});
			setPicLoading(false);
			return;
		}
		if (password !== confirmpassword) {
			toast({
				title: "Passwords Do Not Match",
				status: "warning",
				duration: 5000,
				isClosable: true,
				position: "bottom",
			});
			return;
		}
		console.log(name, email, password, pic);
		try {
			const config = {
				headers: {
					"Content-type": "application/json",
				},
			};
			const { data } = await axios.post(
				"http://127.0.0.1:5000/api/user",
				{
					name,
					email,
					password,
					pic,
				},
				config
			);
			console.log(data);
			toast({
				title: "Registration Successful",
				status: "success",
				duration: 5000,
				isClosable: true,
				position: "bottom",
			});
			localStorage.setItem("userInfo", JSON.stringify(data));
			setPicLoading(false);
			history.push("/chats");
		} catch (error) {
			toast({
				title: "Error Occured!",
				description: error.response.data.message,
				status: "error",
				duration: 5000,
				isClosable: true,
				position: "bottom",
			});
			setPicLoading(false);
		}
	};

	const postDetails = (pics) => {
		setPicLoading(true);
		if (pics === undefined) {
			toast({
				title: "Please Select an Image!",
				status: "warning",
				duration: 5000,
				isClosable: true,
				position: "bottom",
			});
			return;
		}
		console.log(pics);
		if (pics.type === "image/jpeg" || pics.type === "image/png") {
			const fileName = new Date().getTime() + pics.name;
			const storage = getStorage(app);
			const storageRef = ref(storage, fileName);
			const uploadTask = uploadBytesResumable(storageRef, pics);

			// Register three observers:
			// 1. 'state_changed' observer, called any time the state changes
			// 2. Error observer, called on failure
			// 3. Completion observer, called on successful completion
			uploadTask.on(
				"state_changed",
				(snapshot) => {
					// Observe state change events such as progress, pause, and resume
					// Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
					const progress =
						(snapshot.bytesTransferred / snapshot.totalBytes) * 100;
					console.log("Upload is " + progress + "% done");
					switch (snapshot.state) {
						case "paused":
							console.log("Upload is paused");
							break;
						case "running":
							console.log("Upload is running");
							break;
						default:
					}
				},
				(error) => {
					// Handle unsuccessful uploads
					setPicLoading(false);
				},
				() => {
					// Handle successful uploads on complete
					// For instance, get the download URL: https://firebasestorage.googleapis.com/...
					getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
						setPic(downloadURL);
						setPicLoading(false);
					});
				}
			);
		} else {
			toast({
				title: "Please Select an Image!",
				status: "warning",
				duration: 5000,
				isClosable: true,
				position: "bottom",
			});
			setPicLoading(false);
			return;
		}
	};

	return (
		<VStack spacing="5px">
			<FormControl id="first-name" isRequired>
				<FormLabel>Name</FormLabel>
				<Input
					placeholder="Enter Your Name"
					onChange={(e) => setName(e.target.value)}
				/>
			</FormControl>
			<FormControl id="email" isRequired>
				<FormLabel>Email Address</FormLabel>
				<Input
					type="email"
					placeholder="Enter Your Email Address"
					onChange={(e) => setEmail(e.target.value)}
				/>
			</FormControl>
			<FormControl id="password" isRequired>
				<FormLabel>Password</FormLabel>
				<InputGroup size="md">
					<Input
						type={show ? "text" : "password"}
						placeholder="Enter Password"
						onChange={(e) => setPassword(e.target.value)}
					/>
					<InputRightElement width="4.5rem">
						<Button h="1.75rem" size="sm" onClick={handleClick}>
							{show ? "Hide" : "Show"}
						</Button>
					</InputRightElement>
				</InputGroup>
			</FormControl>
			<FormControl id="password" isRequired>
				<FormLabel>Confirm Password</FormLabel>
				<InputGroup size="md">
					<Input
						type={show ? "text" : "password"}
						placeholder="Confirm password"
						onChange={(e) => setConfirmpassword(e.target.value)}
					/>
					<InputRightElement width="4.5rem">
						<Button h="1.75rem" size="sm" onClick={handleClick}>
							{show ? "Hide" : "Show"}
						</Button>
					</InputRightElement>
				</InputGroup>
			</FormControl>
			<FormControl id="pic">
				<FormLabel>Upload your Picture</FormLabel>
				<Input
					type="file"
					p={1.5}
					accept="image/*"
					onChange={(e) => postDetails(e.target.files[0])}
				/>
			</FormControl>
			<Button
				colorScheme="blue"
				width="100%"
				style={{ marginTop: 15 }}
				onClick={submitHandler}
				isLoading={picLoading}
			>
				Sign Up
			</Button>
		</VStack>
	);
};

export default Signup;

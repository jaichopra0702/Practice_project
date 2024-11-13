const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../model/userModel");
require("dotenv").config();

// Register a new user
const registerUser = asyncHandler(async (req, res) => {
    const { firstName, lastName, age, gender, bloodGroup, email, phoneNumber, password } = req.body;

    // Validate all required fields
    if (!firstName || !lastName || !age || !gender || !bloodGroup || !email || !phoneNumber || !password) {
        res.status(400);
        throw new Error("Please fill all fields");
    }

    // Check if the user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
        return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user
    const newUser = await User.create({
        firstName,
        lastName,
        age,
        gender,
        bloodGroup,
        email,
        phoneNumber,
        password: hashedPassword,
    });

    // Return the created user data without the password
    res.status(201).json({
        message: "User registered successfully",
        user: {
            id: newUser._id,
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            age: newUser.age,
            gender: newUser.gender,
            bloodGroup: newUser.bloodGroup,
            email: newUser.email,
            phoneNumber: newUser.phoneNumber,
        },
    });
});

// Login user
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Validate email and password
    if (!email || !password) {
        res.status(400);
        throw new Error("Please fill all fields");
    }

    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
    }

    // Create JWT token
    const token = jwt.sign(
        { userId: user._id, username: user.firstName },
        process.env.PRIVATE_KEY,
        { expiresIn: "1h" }
    );

    res.status(200).json({ message: "Login successful", token });
});

const myAccount = asyncHandler(async (req, res) => {
    // The userId is available in req.user after successful token validation
    const userId = req.user.userId; // This comes from the 'validateJwtToken' middleware

    // Fetch the user by the userId (from the decoded token)
    const user = await User.findById(userId);

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    // Send the user information (excluding the password) in the response
    // res.status(200).json({
    //     user: {
    //         id: user._id,
    //         firstName: user.firstName,
    //         lastName: user.lastName,
    //         age: user.age,
    //         gender: user.gender,
    //         bloodGroup: user.bloodGroup,
    //         email: user.email,
    //         phoneNumber: user.phoneNumber,
    //         createdAt: user.createdAt,
    //         updatedAt: user.updatedAt
    //     }
    // });
    Object.assign(user, req.body);

    await user.save();

    res.send(user);
    
});

module.exports = { registerUser, loginUser, myAccount };

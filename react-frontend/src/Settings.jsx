import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase";
import "./frontpage-styles.css";
import { useNavigate } from "react-router-dom";
import logo from "./assets/RoyalFlushAILogo.png";

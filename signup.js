import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";

const auth = getAuth();
const db = getFirestore();

document.getElementById("signup-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const userType = document.querySelector('input[name="userType"]:checked').value;
  const farmAddress = document.getElementById("farmAddress")?.value || "";
  const farmSize = document.getElementById("farmSize")?.value || "";

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const uid = userCredential.user.uid;

    const userData = {
      name,
      email,
      userType,
    };

    // Only include farmer fields if user is a farmer
    if (userType === "farmer") {
      userData.farmAddress = farmAddress;
      userData.farmSize = farmSize;
    }

    await setDoc(doc(db, "users", uid), userData);
    alert("Account created successfully!");
    window.location.href = "login-sign.html";
  } catch (error) {
    alert("Error creating account: " + error.message);
  }
});
document.querySelectorAll('input[name="userType"]').forEach((radio) => {
    radio.addEventListener("change", () => {
      const farmerFields = document.getElementById("farmerFields");
      if (document.querySelector('input[name="userType"]:checked').value === "farmer") {
        farmerFields.style.display = "block";
      } else {
        farmerFields.style.display = "none";
      }
    });
  });
  
  // Hide initially if buyer is selected by default
  window.onload = () => {
    if (document.querySelector('input[name="userType"]:checked').value === "buyer") {
      document.getElementById("farmerFields").style.display = "none";
    }
  };
  
function showPage(page) {
  document.getElementById("home-page").style.display = "none";
  document.getElementById("login-page").style.display = "none";
  document.getElementById("create-account-page").style.display = "none";

  if (page === "login") {
    document.getElementById("login-page").style.display = "block";
  } else if (page === "create-account") {
    document.getElementById("create-account-page").style.display = "block";
  }
}

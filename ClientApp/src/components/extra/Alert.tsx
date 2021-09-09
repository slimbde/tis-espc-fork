
export const blinkAlert = (text: string, valid: boolean) => {
  const alert = document.getElementById("alert") as HTMLElement
  alert.classList.remove("alert-success")
  alert.classList.remove("alert-danger")
  alert.classList.add(valid ? "alert-success" : "alert-danger")
  alert.textContent = text
  alert.style.opacity = "1"
  setTimeout(() => alert.style.opacity = "0", 3000)
}
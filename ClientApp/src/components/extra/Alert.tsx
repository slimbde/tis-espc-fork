
export const Alert: React.FC<{ children?: string }> = ({ children }) => <div id="alert">{children}</div>


export const blinkAlert = (text: string, valid: boolean) => {
  const alert = document.getElementById("alert") as HTMLElement
  !valid && alert.classList.add("bad-alert")
  alert.textContent = text
  alert.style.opacity = "1"
  alert.style.zIndex = "10"
  setTimeout(() => {
    alert.style.opacity = "0"
    alert.style.zIndex = "0"
    alert.classList.remove("bad-alert")
  }, 3000)
}
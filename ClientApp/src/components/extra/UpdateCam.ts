
export const UpdateCam = (url: string, target: HTMLImageElement, token: AbortController) => {
  target.src = `${url}?t=${Math.random()}`

  const callMeOneMoreTime = () => {
    !token.signal.aborted && setTimeout(() => UpdateCam(url, target, token), 5000)
    target.parentElement!.style.opacity = "1"
  }

  target.onload = callMeOneMoreTime
  target.onerror = callMeOneMoreTime

}
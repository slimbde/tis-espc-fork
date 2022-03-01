
export const UpdateCam = (url: string, target: HTMLImageElement) => {
  const img = new Image()
  img.src = url

  const load = () => {
    target.src = `${img.src}?tt=${Math.random()}`

    const callMeOneMoreTime = () => setTimeout(() => UpdateCam(img.src, target), 5000)
    target.onload = callMeOneMoreTime
    target.onerror = callMeOneMoreTime
  }

  img.onload = load
  img.onerror = load
}
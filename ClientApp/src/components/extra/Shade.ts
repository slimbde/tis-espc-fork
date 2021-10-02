
export const applyShade = () => {
  const shade = document.getElementById("shade")
  shade && (shade.style.visibility = "visible")
}

export const removeShade = () => {
  const shade = document.getElementById("shade")
  shade && (shade.style.visibility = "hidden")
}

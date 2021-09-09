/** expanding basic layout container to fit all the params */
export const setFluid = (set: boolean = false) => {
  const root = document.getElementsByClassName("root-wrapper")
  set && root.length > 0 && (root[0].classList.add("container-fluid"))
  !set && root.length > 0 && (root[0].classList.remove("container-fluid"))
}
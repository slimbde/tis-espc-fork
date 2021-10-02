
// to prevent authentication request when reaching images
// I placed a virtual directory at the non-protected frontend instance on the server
// And the virtual directory points to the images folder and no authentication needed
const host = "http://10.2.19.193:82/"
const ccmPath = "screen/img_ccm/"
const akpPath = "screen/img_lf/"
const vodPath = "screen/img_vod/"

export const armsList = {
  ccmArm1: `${host}${ccmPath}arm1.jpg`,
  ccmArm2: `${host}${ccmPath}arm2.jpg`,
  gega: `${host}${ccmPath}arm_gega.jpg`,
  fda: `${host}${ccmPath}fda.jpg`,
  mbps: `${host}${ccmPath}mbps.jpg`,
  akpArm1: `${host}${akpPath}arm1.jpg`,
  akpArm2: `${host}${akpPath}arm2.jpg`,
  hiReg: `${host}${akpPath}Hi_reg.jpg`,
  vdArm1: `${host}${vodPath}Arm1.jpg`,
  vdArm2: `${host}${vodPath}Arm2.jpg`,
  vdArm3: `${host}${vodPath}Arm3.jpg`,
}

export const armsNames = {
  ccmArm1: "МНЛЗ АРМ1",
  ccmArm2: "МНЛЗ АРМ2",
  gega: "МНЛЗ Гега",
  fda: "FDA",
  mbps: "MBPS",
  akpArm1: "АКП АРМ1",
  akpArm2: "АКП АРМ2",
  hiReg: "Hi REG",
  vdArm1: "Вакууматор АРМ1",
  vdArm2: "Вакууматор АРМ2",
  vdArm3: "Вакууматор АРМ3",
}

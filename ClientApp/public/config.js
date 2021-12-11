
window.config = {
  backendHost: "http://10.2.10.84:83/api",
  host: "http://10.2.19.193:82",
  imgPath: "Overview",
  oldImgPath: "Screen",
}

window.config.hostPath = `${window.config.host}/${window.config.imgPath}`
window.config.oldHostPath = `${window.config.host}/${window.config.oldImgPath}`

// I placed a virtual directory at the non-protected frontend instance on the server
// And the virtual directory points to the images folder and no authentication needed
window.config.armsList = {
  ccmArm1: `${window.config.hostPath}/espo-ccm2-arm1.png`,
  ccmArm2: `${window.config.oldHostPath}/img_ccm/arm2.jpg`,
  gega: `${window.config.oldHostPath}/img_ccm/arm_gega.jpg`,
  fda: `${window.config.oldHostPath}/img_ccm/fda.jpg`,
  mbps: `${window.config.oldHostPath}/img_ccm/mbps.jpg`,
  akpArm1: `${window.config.oldHostPath}/img_lf/arm1.jpg`,
  akpArm2: `${window.config.oldHostPath}/img_lf/arm2.jpg`,
  hiReg: `${window.config.oldHostPath}/img_lf/Hi_reg.jpg`,
  vdArm1: `${window.config.oldHostPath}/img_vod/Arm1.jpg`,
  vdArm2: `${window.config.oldHostPath}/img_vod/Arm2.jpg`,
  vdArm3: `${window.config.oldHostPath}/img_vod/Arm3.jpg`,
}

window.config.armsNames = {
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

import { UserRole } from "models/types/Auth/UserRole"
import backendHost from "./backendHost"

class AuthDbHandler {
  private static instance: AuthDbHandler
  protected backend = backendHost

  private constructor() { }

  public static GetInstance(): AuthDbHandler {
    !this.instance && (this.instance = new AuthDbHandler())
    return this.instance
  }


  async GetUserNameAsync(): Promise<string> {
    const resp = await fetch(`${this.backend}/auth/GetUserName`, {
      credentials: "include"
    })

    if (resp.status >= 400)
      throw new Error(`[AuthDbHandler]: ${await resp.text()}`)

    return await resp.text()
  }


  async GetUserRoleAsync(): Promise<string> {
    const resp = await fetch(`${this.backend}/auth/GetUserRole`, {
      credentials: "include"
    })

    if (resp.status >= 400)
      throw new Error(`[AuthDbHandler]: ${await resp.text()}`)

    return await resp.json()
  }


  async GetUsersForRoleAsync(role: string): Promise<string[]> {
    const resp = await fetch(`${this.backend}/auth/GetUsersForRole?role=${role}`, {
      credentials: "include"
    })

    if (resp.status >= 400)
      throw new Error(`[AuthDbHandler]: ${await resp.text()}`)

    return await resp.json()
  }


  async AddUserToRoleAsync(user: string, role: string): Promise<boolean> {
    const resp = await fetch(`${this.backend}/auth/AddUserToRole?user=${user}&role=${role}`, {
      credentials: "include"
    })

    if (resp.status >= 400)
      throw new Error(`[AuthDbHandler]: ${await resp.text()}`)

    return true;
  }


  async DeleteUserAsync(user: string, role: string): Promise<boolean> {
    const resp = await fetch(`${this.backend}/auth/DeleteUser?user=${user}&role=${role}`, {
      credentials: "include"
    })

    if (resp.status >= 400)
      throw new Error(`[AuthDbHandler]: ${await resp.text()}`)

    return true;
  }


  StashRole(role: string): void {
    const keyEncoded = btoa("userRole")
    const roleEncoded = btoa(unescape(encodeURIComponent(role)))
    localStorage.setItem(keyEncoded, roleEncoded)
  }


  GetRoleFromStash(): UserRole {
    const keyEncoded = btoa("userRole")
    const value = localStorage.getItem(keyEncoded)
    if (value) {
      if (value === btoa(unescape(encodeURIComponent("Пользователь")))) return UserRole.Пользователь
      if (value === btoa(unescape(encodeURIComponent("Технолог")))) return UserRole.Технолог
      if (value === btoa(unescape(encodeURIComponent("Программист")))) return UserRole.Программист
      if (value === btoa(unescape(encodeURIComponent("Администратор")))) return UserRole.Администратор
    }

    return UserRole.Пользователь
  }
}

export default AuthDbHandler.GetInstance()

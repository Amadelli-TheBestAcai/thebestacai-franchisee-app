interface User {
  id: number
  name: string
  email: string
  level: number
  permissions: string[]
}

class CurrentUser {
  private id: number
  private name: string
  private email: string
  private level: number
  private permissions: string[]

  logIn(_user: User): void {
    this.id = _user?.id
    this.name = _user?.name
    this.email = _user?.email
    this.level = _user?.level
    this.permissions = _user?.permissions
  }

  hasPermission(_permission: string): boolean {
    return this.permissions?.some((permission) => permission === _permission)
  }

  getUser(): User {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      level: this.level,
      permissions: this.permissions,
    }
  }
}

export default new CurrentUser()

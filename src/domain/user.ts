class User {
    username:string
    cash:number
    readonly email:string
    
    constructor(username:string,email:string,cash:number){
        this.username = username
        this.cash = cash
        this.email = email
    }

    static validateUsername(username:string):boolean{
        const pattern: RegExp = /^([a-zA-Z0-9_])*$/ // only include characters from a-Z and 0-9
        return (pattern.test(username) && username.length < 15 && username.length > 3)
    }
}

export default User
const Constants ={
    PASSWORD_REGEX:'^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$',
}
Object.freeze(Constants);
export default Constants;
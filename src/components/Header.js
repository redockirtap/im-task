const Header = ({ login }) => {
    return (
        <header>
            <h1>Hello, {login}!</h1>
        </header>
    )
}

Header.defaultProps = {
    login: "anon",
}

export default Header
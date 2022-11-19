const Header = ({ login }) => {
    return (
        <header className="header">
            { login && <h3>Hello, {login}!</h3>}
        </header>
    )
}

export default Header
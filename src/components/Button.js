
const Button = ({ className, text, onClick,  }) => {
  return (
    <button className={className} onClick={onClick} >{text}</button>
  )
}

Button.defaultProps = {
  className: "btn",
}

export default Button
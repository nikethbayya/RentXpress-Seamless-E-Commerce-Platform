export const PageHeading = ({ title }) => {
    const headingStyles = {
        fontSize: "3.5rem",
        fontWeight: "500",
        borderBottom: "2px solid var(--border-light-blue-shade)",
    }
    return (
        <h1 style={headingStyles} id="PageHeading">
            {title}
        </h1>
    )
}
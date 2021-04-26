import React from 'react'

const HeaderLevelSelect = props => {
    const { active, headerOptions } = props

    const onToggle = ({ target }) => props.onToggle(target.value)

    return (
        <div className="title-options">
            <label htmlFor="header-level"></label>
            <select id="header-level" value={active} onChange={onToggle} >
                <option value="">Texto Normal</option>

                {headerOptions.map(heading => (
                    <option key={heading.style} value={heading.style}>
                        {heading.label}
                    </option>
                ))}
            </select>
        </div>
    )
}

export default HeaderLevelSelect
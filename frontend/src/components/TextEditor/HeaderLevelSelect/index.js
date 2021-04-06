import React from 'react'

const HeaderLevelSelect = props => {
    const { active, headerOptions } = props

    const onToggle = ({ target }) => props.onToggle(target.value)

    return (
        <div>
            <select value={active} onChange={onToggle}>
                <option value="">Text Normal</option>

                {headerOptions.map(heading => (
                    <option value={heading.style}>
                        {heading.label}
                    </option>
                ))}
            </select>
        </div>
    )
}

export default HeaderLevelSelect
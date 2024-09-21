import React from 'react';

export function headerViewControlTemplate(options) {
    return (
        <div className='header-control-wrapper'>
            {options.commands.map((option, index) => (
                !option.disabled && (
                    <div
                        key={index}
                        className={options.getHeaderClassName(option.signature)}
                        onClick={() => option.onClick()}
                    >
                        {option.icon ? option.icon() : option.value}
                    </div>
                )
            ))}
        </div>
    );
}

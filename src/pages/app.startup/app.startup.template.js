import React from "react";

export function appStartupTemplate(options){
    return (
        <div>
            <div>
                <div className='container text-center'>
                    <div className='login-container-wrapper'>
                        <div className="login-container">

                        </div>
                    </div>
                </div>
                <div className='container'>
                    <div className='text-center'>
                        <div className="loginSection text-center">
                            <form className = 'login-form-view'>
                                <div className="form-group">
                                    {options.formView && options.formView()}
                                </div>
                                <br/>
                                <br/>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};
"use client";
import React from 'react'
import parse from "html-react-parser";
const Publications = (props: any) => {
    return (
        <div className="c-body__content">
            <div className="container custom_container">
                {parse(props.data.content)}

                <div className='row'>
                    <div className='col-12'>
                        <div className='c-body__caringBeyond'>#CaringBeyondBounds</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Publications;
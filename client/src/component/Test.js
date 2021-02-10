import React, { useEffect } from 'react'
import { connect } from 'react-redux';

const Test = ({ profile }) => {

    useEffect(() => {
        console.log(profile)
    }, [])
    return (
        <div>

        </div>
    )
}

const mapStateToProps = state => ({
    profile: state
})

export default connect(mapStateToProps)(Test)


import React from 'react'
import AppHeader from './_components/AppHeader'

const DashboardLayout = ({ children }: any) => {
    return (
        <div>
            <AppHeader />
            {children}
        </div>
    )
}

export default DashboardLayout

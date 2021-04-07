import React from 'react'

export const ColorOption = ({ color }) => (
    <svg width="24" height="32" viewBox="0 0 24 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16.02 16.4548H8.58L7.04 19.9548H4.98L11.32 5.95483H13.3L19.66 19.9548H17.56L16.02 16.4548ZM15.32 14.8548L12.3 7.99483L9.28 14.8548H15.32Z" fill="white"/>
        <rect x="5" y="23.825" width="15" height="2.98305" fill={color}/>
    </svg>
)

export const HighlightOption = ({ color }) => (
    <svg width="24" height="32" viewBox="0 0 24 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="4" y="23.825" width="15" height="2.98305" fill={color}/>
        <path d="M18.6022 7.77966L18.5655 7.81367L18.6021 7.77965L17.337 6.41684C16.7116 5.74311 15.6619 5.69372 14.975 6.30079C7.52548 12.8852 7.36902 13.0145 7.23106 13.1612C7.20783 13.1859 7.18513 13.2111 7.1282 13.2677C6.59833 13.7946 6.38204 14.5708 6.56383 15.2939C6.67093 15.7199 6.54349 16.1778 6.23124 16.4885C6.2312 16.4885 6.23116 16.4885 6.23113 16.4886L4.09615 18.5824C3.7851 18.8875 4.00307 19.4157 4.43953 19.4157H7.27936C7.40899 19.4157 7.53337 19.3645 7.62512 19.2733L8.32776 18.5746C8.64032 18.2638 9.10122 18.1368 9.53006 18.2435C10.264 18.4259 11.0426 18.204 11.5671 17.6824C11.6233 17.6265 11.6486 17.6033 11.6735 17.5797C11.8226 17.4384 11.9584 17.2831 18.6076 10.0517C19.1991 9.40837 19.1976 8.42113 18.6022 7.77966ZM17.8858 9.39469L17.9226 9.42853L17.8858 9.39469L11.4794 16.3621L8.46073 13.3605L15.6248 7.02845C15.9118 6.77474 16.3579 6.79666 16.6184 7.07726L16.705 7.1706V7.16935C16.7237 7.1895 16.7464 7.21402 16.774 7.24384C16.9314 7.41368 17.2477 7.75513 17.8835 8.44007C18.1357 8.71178 18.1367 9.12182 17.8858 9.39469ZM7.29004 18.2303L7.07684 18.4423H5.63257L6.57437 17.5187L7.29004 18.2303ZM9.76723 17.2992C9.16781 17.1501 8.53369 17.2584 8.02063 17.5807L7.22999 16.7945C7.55398 16.2844 7.66277 15.6538 7.51291 15.0577C7.42243 14.6978 7.51351 14.3132 7.75101 14.0309L10.8 17.0627C10.5162 17.2986 10.1293 17.3892 9.76723 17.2992Z" fill="white" stroke="white" strokeWidth="0.1"/>
    </svg>
)

export const OrderedListOption = () => (
    <svg width="24" height="33" viewBox="0 0 24 33" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8.33334 11.3955H20.25" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M8.33334 16.8643H20.25" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M8.33334 22.3333H20.25" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M4.07984 9.54951V13.7495H2.89184V10.4675H2.11184V9.54951H4.07984Z" fill="white"/>
        <path d="M5.40409 18.2765V19.2185H2.13409V18.4745L3.70609 17.0045C3.85809 16.8605 3.96009 16.7385 4.01209 16.6385C4.06409 16.5345 4.09009 16.4305 4.09009 16.3265C4.09009 16.1905 4.04409 16.0845 3.95209 16.0085C3.86009 15.9325 3.72609 15.8945 3.55009 15.8945C3.39409 15.8945 3.25009 15.9305 3.11809 16.0025C2.99009 16.0705 2.88409 16.1705 2.80009 16.3025L1.91809 15.8105C2.08209 15.5385 2.31209 15.3245 2.60809 15.1685C2.90409 15.0125 3.25409 14.9345 3.65809 14.9345C3.97809 14.9345 4.26009 14.9865 4.50409 15.0905C4.75209 15.1945 4.94409 15.3445 5.08009 15.5405C5.22009 15.7325 5.29009 15.9565 5.29009 16.2125C5.29009 16.4405 5.24009 16.6565 5.14009 16.8605C5.04409 17.0605 4.85609 17.2885 4.57609 17.5445L3.78409 18.2765H5.40409Z" fill="white"/>
        <path d="M4.30037 23.0789C4.64837 23.1509 4.91437 23.2949 5.09837 23.5109C5.28637 23.7229 5.38037 23.9809 5.38037 24.2849C5.38037 24.5329 5.31237 24.7629 5.17637 24.9749C5.04437 25.1869 4.84037 25.3589 4.56437 25.4909C4.29237 25.6189 3.95437 25.6829 3.55037 25.6829C3.25437 25.6829 2.96037 25.6469 2.66837 25.5749C2.38037 25.5029 2.13037 25.4009 1.91837 25.2689L2.35037 24.3749C2.51437 24.4869 2.69837 24.5729 2.90237 24.6329C3.11037 24.6929 3.31437 24.7229 3.51437 24.7229C3.71837 24.7229 3.88037 24.6849 4.00037 24.6089C4.12037 24.5329 4.18037 24.4249 4.18037 24.2849C4.18037 24.0129 3.96637 23.8769 3.53837 23.8769H3.04037V23.1269L3.79037 22.3169H2.13437V21.3989H5.17037V22.1429L4.30037 23.0789Z" fill="white"/>
    </svg>
)
import React, { useState, useEffect } from "react"

//add rendering logic to only show the right amount of time. ex: if there are 0hours, dont display

function Main () {
    const [totalSeconds, setTotalSeconds] = useState()
    const [initialTime, setInitialTime] = useState(500)
    const [formattedTime, setFormattedTime] = useState()
    const [isTiming, setIsTiming] = useState(false)

    // useEffect(() => {
        
    // });

    function startTimer () {
        setIsTiming(true)
        setInterval(decrementTotalSeconds(), 1000)
        displayTime()
    }

    function decrementTotalSeconds () {
        setTotalSeconds(totalSeconds - 1)
    }
    
    function stopTimer () {
        setIsTiming(false)
    }

    function resetTimer () {

    }

    function handleChange (event) {
        setInitialTime(event.target.value)
    }

    function splitInput () {
        const parsedTimer = parseInt(initialTime)
        const arr = Array.from(parsedTimer.toString()).map(Number);
        if (arr.length <= 5) {
            const padAmount = 6 - arr.length;
            const arr2 = [...Array(padAmount).fill(0), ...arr]
            return arr2
        }        
        return arr
    }

    function calculateSeconds () {
        const splitArr = splitInput()
        const seconds = []
        const minutes = []
        const hours = []
        hours.push(splitArr[0], splitArr[1])
        minutes.push(splitArr[2], splitArr[3])
        seconds.push(splitArr[4], splitArr[5])
        const totSec = (seconds[0]*10)+seconds[1]
        const totMin = (minutes[0]*600)+(minutes[1]*60)
        const totHours = (hours[0]*36000)+(hours[1]*3600)
        const totalSeconds = totSec+totMin+totHours;
        setTotalSeconds(totalSeconds);
        return totalSeconds
    }

    function displayTime () {
        let formatTime = calculateSeconds()
        let showHours = 0;
        let showMin = 0;
        let showSec = 0;
        let formatted = []
        while (formatTime >= 3600) {
            showHours += 1
            formatTime -= 3600
        }

        while (formatTime > 60) {
            showMin += 1
            formatTime -= 60
        }

        if (formatTime < 60) {
            showSec = formatTime
        }
        formatted.push(showHours)
        formatted.push(showMin)
        formatted.push(showSec)
        console.log("formatted time", formatted)
        setFormattedTime(formatted)
    }

    return (
        <div>
            <input type="text" id="timer" name="timer" maxLength="6" onChange={handleChange} >
            </input>
            {formattedTime && <div>{formattedTime[0]}h {formattedTime[1]}m {formattedTime[2]}s</div>}             
            {!isTiming && <button onClick={startTimer}>Start</button>}        
            {isTiming && <button onClick={stopTimer}>Stop</button>}  
            <button onClick={resetTimer}>Reset</button>
        </div>
    )
}

export default Main
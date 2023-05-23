export function getLoadingBar(large: boolean, customMessage?: string) {
    if (large) {
        return (
            <div className="loader">
                <div className='spin-wrapper'>
                    <div className='spinner'></div>
                    <div className='spinner2'></div>
                    <div className="MT-280px">{customMessage ? customMessage : "Loading, please wait..."}</div>
                </div>
            </div>
        );
    }
    return (
        <span className='icon'>
        <div className='spin-wrapper'>
            <div className='spinner'></div>
            <div className='spinner2'></div>
        </div>
    </span>
    );
}

export function formatDateNoTime(dateString: any) {
    let months: any = []
    months['01'] = "January"
    months['02'] = "February"
    months['03'] = "March"
    months['04'] = "April"
    months['05'] = "May"
    months['06'] = "June"
    months['07'] = "July"
    months['08'] = "August"
    months['09'] = "September"
    months['10'] = "October"
    months['11'] = "November"
    months['12'] = "December"
    try {
        var data = dateString.toString().split('/')
        return "     " + (data.length === 3 ? data[0] + " " + months[data[1]].substr(0, 3) + " '" + data[2].substr(2, 2) : dateString) + "     "
    } catch (e) {
    }
    return dateString
}


export function getStochasticPerCent(data: any) {
    let newData: any = []
    if (data) {
        data.map((i: any) => {
            return (
                newData.push({...i, csri: ((i.openClose[1] - i.low) / (i.high - i.low)) * 100})
            )
        })
    }
    return newData
}

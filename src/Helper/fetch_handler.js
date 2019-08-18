export function handleFetch(endPoint, history, onJsonReceived) {
	fetch(endPoint)
		.then((data) => {
			if (data.ok) return data.json()
			else throw new Error(data.statusText)
		})
		.then((resultJson) => {
			onJsonReceived(resultJson)
		})
		.catch((err) => {
			handleRedirect(history, '/server_err')
		})
}


export function handleRedirect(history, redirect='generic')
{
	history.push(redirect)
}


export default { handleFetch, handleRedirect }